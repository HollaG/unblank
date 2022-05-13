import {
    Box,
    Button,
    Heading,
    useColorModeValue,
    Text,
    Stack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CharacterInput from "./CharacterInput";
import InfoBox from "./InfoBox";
import CountdownBox from "./CountdownBox";
import WordBox from "./WordBox";
import EndedText from "./EndedText";
import { createBigIntLiteral } from "typescript";

const loadJson = (): Promise<any> => {
    return new Promise((res, rej) => {
        import(`../../words.json`).then((data) => {
            res(data?.default);
        });
    });
};

export const CHALLENGE_WORDS_NUMBER = 25;

export interface PlayerData {
    timeTaken: number;
    wordsCorrect: string[];
    wordsSkipped: string[];
    progressData: ProgressData[];
}

export interface ProgressData {
    skipped: boolean;
    timeTaken: number;
    numberTimesTried: number; // the number of times the player filled in all the characters.,
    word: string;
    startTimestamp: number;
    numberMissingCharacters: number
}
const Challenge: React.FC = () => {
    const [gameData, setGameData] = useState<{
        words: string[];
        byLength: { [key: string]: { [key: string]: number } };
    }>();
    console.log({ gameData });
    useEffect(() => {
        let loadJsonAsync = async () => {
            const data = await loadJson();
            setGameData(data);
        };
        loadJsonAsync();
    }, []);

    const [gameStatus, setGameStatus] = useState(0);
    const inProgress = gameStatus === 1 || gameStatus === 2;
    /*
        0: not started
        1: starting (count down)
        2: started (counting)
        3: ended
    */

    const startGameCountdown = () => {
        setGameStatus(1);
        setCorrectAnswer([""]);
    };

    const startGame = () => {
        setGameStatus(2);
        // for (let i = 0; i < 100; i++) {
        chooseNewWord();
        // }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    // Main game logic starts here
    const defaultValues = useMemo(
        () => ({
            currentWord: "",
            correctAnswer: [],
            enteredAnswer: [],
            blankedWord: "",
            answerIsWrong: false,
            currentWordNumber: 1,
            playerData: {
                timeTaken: 0,
                wordsCorrect: [],
                wordsSkipped: [],
                progressData: [],
            },
            wordPlayerData: {}
        }),
        []
    );
    const [currentWord, setCurrentWord] = useState(defaultValues.currentWord);
    const [correctAnswer, setCorrectAnswer] = useState<string[]>(
        defaultValues.correctAnswer
    );
    const [enteredAnswer, setEnteredAnswer] = useState<string[]>(
        defaultValues.enteredAnswer
    );
    const [blankedWord, setBlankedWord] = useState(defaultValues.blankedWord);
    const [answerIsWrong, setAnswerIsWrong] = useState(
        defaultValues.answerIsWrong
    );
    const [currentWordNumber, setCurrentWordNumber] = useState(
        defaultValues.currentWordNumber
    );

    const [playerData, setPlayerData] = useState<PlayerData>(defaultValues.playerData);

    
    console.log(`The word is %c${currentWord}`, "background: white; color: black;");

    /* Pick a new word */
    const chooseNewWord = useCallback(() => {
        // pick a random word from the list
        const randomWord =
            gameData?.words[
                Math.floor(Math.random() * gameData?.words.length)
            ] || "";
        setCurrentWord(randomWord);

        // pick a random number of characters to remove from the word
        // conditions:
        // - maximum 75% of the word can be removed
        // - minimum 1 character must be removed
        // - adjustable difficulty
        let numberOfCharactersToRemove = Math.floor(
            Math.random() * Math.floor(randomWord.length * 0.75)
        );
        if (numberOfCharactersToRemove === 0) {
            numberOfCharactersToRemove =
                Math.floor(randomWord.length * 0.4) || 1;
        }

        // numberOfCharactersToRemove = 3
        // randomWord = "hello"

        // Generate 3 unique numbers from 0 to (randomWord.length - 1)
        // Output: [0, 1, 2]

        const indexesToRemove: number[] = [];
        while (indexesToRemove.length < numberOfCharactersToRemove) {
            const randomNumber = Math.floor(Math.random() * randomWord.length);
            if (!indexesToRemove.includes(randomNumber)) {
                indexesToRemove.push(randomNumber);
            }
        }

        const splitIntoChars = randomWord.split("");
        const blankedWord = splitIntoChars
            .map((char, index) => {
                if (indexesToRemove.includes(index)) {
                    return "_";
                } else {
                    return char;
                }
            })
            .join(" ");

        setBlankedWord(blankedWord);

        const answer = indexesToRemove.map((index) => {
            return splitIntoChars[index];
        });
        setCorrectAnswer(answer);

        // Add a new wordPlayerData
        setWordPlayerData((prevState) => ({
            ...prevState,
            [randomWord]: {
                skipped: false,
                numberTimesTried: 0,
                startTimestamp: Date.now(),
                timeTaken: 0,
                word: randomWord,
                numberMissingCharacters: numberOfCharactersToRemove
            }
        }))
    }, [gameData]);

    /* Skip current word */
    const skipWord = () => {
        // setPlayerData((prevState) => (
        //      {
        //         ...prevState,
        //         wordsSkipped: [...prevState.wordsSkipped, currentWord],
        //     };
        // ))
        setPlayerData((prevState) => ({
            ...prevState,
            wordsSkipped: [...prevState.wordsSkipped, currentWord],
        }));
        setWordPlayerData((prevState) => ({
            ...prevState,
            [currentWord]: {
                ...prevState[currentWord],
                skipped: true,
                timeTaken: Date.now() - prevState[currentWord].startTimestamp,
            }
        }))
        progressGame();
    };

    /* Advance to the next word */
    const progressGame = useCallback(() => {
        if (currentWordNumber === CHALLENGE_WORDS_NUMBER) {
            // game has ended!
            setGameStatus(3);
        } else {
            setEnteredAnswer([]);
            chooseNewWord();
            setAnswerIsWrong(false);
            setCurrentWordNumber((prevState) => (prevState = prevState + 1));
        }
    }, [chooseNewWord, currentWordNumber]);

    /* Keeps track of the player's performance per word. */
    const [wordPlayerData, setWordPlayerData] = useState<{
        [key: string]: ProgressData;
    }>(defaultValues.wordPlayerData);
    console.log({ wordPlayerData });

    /* Checks to see if the player has entered the correct characters */
    useEffect(() => {
        if (gameStatus === 2) {
            if (enteredAnswer.length !== correctAnswer.length) return;

            setWordPlayerData((prevState) => {
                if (!prevState[currentWord]) {
                    // new word (this shouldn't run because we always set the property when we select a new word)
                    return {
                        ...prevState,
                        [currentWord]: {
                            skipped: false,
                            numberTimesTried: 1,
                            startTimestamp: Date.now(),
                            timeTaken: 0,
                            word: currentWord,
                            numberMissingCharacters: correctAnswer.length
                        },
                    };
                } else {
                    return {
                        ...prevState,
                        [currentWord]: {
                            ...prevState[currentWord],
                            numberTimesTried:
                                prevState[currentWord].numberTimesTried + 1,
                        },
                    };
                }
            });

            console.log({ enteredAnswer });
            const splitCorrectWord = blankedWord.split(" ");
            let blankNumber = 0;
            let checkWordArray: string[] = [];
            splitCorrectWord.forEach((char) => {
                if (char === "_") {
                    checkWordArray.push(enteredAnswer[blankNumber]);
                    blankNumber++;
                } else {
                    checkWordArray.push(char);
                }
            });
            const checkWord = checkWordArray.join("");
            console.log(`Checking word ${checkWord}...`);
            // check if the word exists in gameData

            if (gameData?.byLength[currentWord.length][checkWord]) {
                // exists, answer is correct 
                /* Note: The 'accepted word' (checkWord) might be different from the original, intended word (currentWord). This is on purpose. */

                setPlayerData((prevState) => ({
                    ...prevState,
                    wordsCorrect: [...prevState.wordsCorrect, checkWord],
                }));
                setWordPlayerData((prevState) => ({
                    ...prevState,
                    [currentWord]: {
                        ...prevState[currentWord],
                        timeTaken:
                            Date.now()
                             - prevState[currentWord].startTimestamp,
                        skipped: false,
                        word: checkWord,
                    },
                }));

                progressGame();
            } else {
                // doesn't exist
                // set to red
                setAnswerIsWrong(true);
                
            }
        }
    }, [
        blankedWord,
        enteredAnswer,
        gameStatus,
        gameData,
        currentWord,
        correctAnswer,
        progressGame,
    ]);


    /* Reset game back to the start */
    const reset = useCallback(() => {
        setCurrentWord(defaultValues.currentWord);
        setCorrectAnswer(defaultValues.correctAnswer);
        setEnteredAnswer(defaultValues.enteredAnswer);
        setBlankedWord(defaultValues.blankedWord);
        setAnswerIsWrong(defaultValues.answerIsWrong);
        setCurrentWordNumber(defaultValues.currentWordNumber);
        setPlayerData(defaultValues.playerData);
        setWordPlayerData(defaultValues.wordPlayerData);
        setGameStatus(1);
        setCorrectAnswer([""])
    }, [defaultValues]);

    // Colors
    const mainBoxBackgroundColor = useColorModeValue("blue.100", "gray.700");


    return (
        <Stack spacing={4} justifyContent="center">
            <Heading textAlign="center"> Challenge mode </Heading>

            <Box
                backgroundColor={mainBoxBackgroundColor}
                w="100%"
                p={8}
                borderRadius="md"
                textAlign={"center"}
            >
                {gameStatus === 0 && <InfoBox startGame={startGameCountdown} />}
                {gameStatus === 1 && <CountdownBox startGame={startGame} />}
                {gameStatus === 2 && (
                    <WordBox
                        word={blankedWord}
                        progress={currentWordNumber}
                        setPlayerData={setPlayerData}
                    />
                )}
                {gameStatus === 3 && (
                    <Stack>
                        <Text> Game has ended!</Text>
                        <Box textAlign="center">
                            <Button
                                size="sm"
                                onClick={() => reset()}
                                colorScheme="blue"
                            >
                                {" "}
                                Try again{" "}
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Box>

            {inProgress && (
                <Stack textAlign="center">
                    <Text> Type the missing characters below </Text>
                    <CharacterInput
                        correctAnswer={correctAnswer}
                        setCorrectAnswer={setCorrectAnswer}
                        inputRef={inputRef}
                        enteredAnswer={enteredAnswer}
                        setEnteredAnswer={setEnteredAnswer}
                        answerIsWrong={answerIsWrong}
                    />
                    <Box>
                        <Button onClick={() => skipWord()} disabled={gameStatus !== 2}> Skip </Button>
                    </Box>
                </Stack>
            )}
            {gameStatus === 0 && (
                <Text textAlign="center">
                    {" "}
                    Any correct filler characters will be accepted. For example,
                    for the word B _ _ T, both "O, A" and "E, A" will be
                    accepted.
                </Text>
            )}
            {gameStatus === 3 && <EndedText playerData={playerData} wordPlayerData={wordPlayerData} />}
        </Stack>
    );
};

export default Challenge;
