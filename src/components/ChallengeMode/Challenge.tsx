import {
    Box,
    Button,
    Heading,
    useColorModeValue,
    Text,
    Stack,
    useMediaQuery,
    Center,
    Flex,
    Spacer,
    Link,
    Collapse,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CharacterInput from "./CharacterInput";
import InfoBox from "./InfoBox";
import CountdownBox from "./CountdownBox";
import WordBox from "./WordBox";
import EndedText from "./EndedText";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserView, isMobile, MobileView } from "react-device-detect";
import Queue from "../Stickmen/Queue";
import { vibrateError, vibrateSuccess } from "../../functions";

export const CHALLENGE_WORDS_NUMBER = 24;

export interface PlayerData {
    timeTaken: number;
    mode: number;
    wordsCorrect: string[];
    wordsSkipped: string[];
    progressData: ProgressData[];
}

export interface ProgressData {
    skipped: boolean;
    timeTaken: number;
    numberTimesTried: number; // the number of times the player filled in all the characters.,
    word: string;
    actualWord: string;
    number: number;
    startTimestamp: number;
    numberMissingCharacters: number;
    points?: number;
}
const Challenge: React.FC = () => {
    // 0 - normal
    // 1 - hardcore
    const [gameMode, setGameMode] = useState<0 | 1>(0);

    /* Fetch the dictionary asynchronously */
    const [gameData, setGameData] = useState<{
        words: string[];
        byLength: { [key: string]: { [key: string]: number } };
    }>();

    const [acceptedWords, setAcceptedWords] = useState<{ [key: string]: 1 }>();
    const [previousWords, setPreviousWords] = useState<string[]>([]);
    useEffect(() => {
        // let loadJsonAsync = async () => {
        //     const data = await loadJson();
        //     setGameData(data);
        // };
        // loadJsonAsync();
        fetch("./words.json")
            .then((response) => response.json())
            .then((data) => setGameData(data));
        fetch("./words_dictionary.json")
            .then((response) => response.json())
            .then((data) => setAcceptedWords(data));
    }, []);

    const gameIsReady = !!gameData && !!acceptedWords;

    /* Scroll to word box when game starting (only if mobile!) */
    const wordBoxRef = useRef<HTMLDivElement>(null);

    const [gameStatus, setGameStatus] = useState(0);
    const inProgress = gameStatus === 1 || gameStatus === 2;

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
                startTimestamp: 0,
                timeTaken: 0,
                mode: 0,
                wordsCorrect: [],
                wordsSkipped: [],
                progressData: [],
            },
            wordPlayerData: {},
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

    const [playerData, setPlayerData] = useState<PlayerData>(
        defaultValues.playerData
    );

    /* Pick a new word */
    const chooseNewWord = useCallback(() => {
        // pick a random word from the list

        // For NORMAL mode, words allowed are 3-7 characters in length, inclusive
        // for HARDCORE mode, words from 7-14 characters are allowed.

        let randomWord = "";
        do {
            const wordLength =
                gameMode === 0
                    ? Math.floor(Math.random() * (7 - 3)) + 3
                    : Math.floor(Math.random() * (14 - 7)) + 7;
            // : Math.floor(Math.random() * (14 - 3 + 1)) + 3;

            const wordsOfThisLength = Object.keys(
                gameData?.byLength?.[wordLength] || {}
            );
            const word =
                wordsOfThisLength?.[
                    Math.floor(Math.random() * wordsOfThisLength.length)
                ];
            randomWord = word;
        } while (previousWords.includes(randomWord));

        // const randomWord =
        //     gameData?.words[
        //         Math.floor(Math.random() * gameData?.words.length)
        //     ] || "";
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
                actualWord: randomWord,
                number: Object.keys(prevState)?.length || 0,
                numberMissingCharacters: numberOfCharactersToRemove,
            },
        }));

        setPreviousWords((prevState) => [...prevState, randomWord]);
        console.log(
            `The word is %c${randomWord}`,
            "background: white; color: black;"
        );
    }, [gameData, gameMode, previousWords]);

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

    /* Skip current word */
    const skipWord = useCallback(() => {
        if (gameStatus === 2) {
            setPlayerData((prevState) => ({
                ...prevState,
                wordsSkipped: [...prevState.wordsSkipped, currentWord],
            }));
            setWordPlayerData((prevState) => ({
                ...prevState,
                [currentWord]: {
                    ...prevState[currentWord],
                    skipped: true,
                    timeTaken:
                        Date.now() - prevState[currentWord].startTimestamp,
                },
            }));
            progressGame();
        }
    }, [progressGame, currentWord, gameStatus]);
    /* Keeps track of the player's performance per word. */
    const [wordPlayerData, setWordPlayerData] = useState<{
        [key: string]: ProgressData;
    }>(defaultValues.wordPlayerData);

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
                            numberMissingCharacters: correctAnswer.length,
                            actualWord: currentWord,
                            number: Object.keys(prevState)?.length || 0,
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
            // check if the word exists in gameData

            const exists = acceptedWords?.[checkWord]; // use the master list
            if (exists) {
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
                            Date.now() - prevState[currentWord].startTimestamp,
                        skipped: false,
                        word: checkWord,
                    },
                }));

                progressGame();
            } else {
                // doesn't exist
                // set to red
                setAnswerIsWrong(true);
                vibrateError(navigator)
                setEnteredAnswer([]);
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
        acceptedWords,
    ]);

    /*
        0: not started
        1: starting (count down)
        2: started (counting)
        3: ended
    */

    const startGameCountdown = useCallback(() => {
        if (!gameIsReady) return;
        setGameStatus(1);
        setCorrectAnswer([""]);
        if (inputRef && inputRef.current) {          
            inputRef.current.focus();
        }
        isMobile && wordBoxRef.current?.scrollIntoView({ behavior: "smooth" });
        setPlayerData((prev) => ({
            ...prev,
            mode: gameMode,
            startTimestamp: Date.now(),
        }));
    }, [gameIsReady, gameMode, inputRef, wordBoxRef]);
            

    const startGame = useCallback(() => {
        setGameStatus(2);

        chooseNewWord();
    }, [chooseNewWord]);
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
        setCorrectAnswer([""]);
        setPreviousWords([]);
    }, [defaultValues]);

    // Colors
    const mainBoxBackgroundColor = useColorModeValue("blue.100", "gray.700");

    // change border from curve to flat at 800px viewport mark
    const [widthLargerThan800] = useMediaQuery("(min-width: 800px)");

    return (
        <Stack spacing={4} justifyContent="center">
            <Collapse in={!inProgress}>
                <Stack spacing={4} justifyContent="center" pt={5} pb={1}>
                    <Box>
                        <Heading textAlign="center" px={2}>
                            {" "}
                            {gameMode === 0 ? "Normal" : "Hardcore"} mode{" "}
                        </Heading>

                        {
                            <Text
                                mt={0}
                                textAlign="center"
                                fontWeight="light"
                                px={2}
                            >
                                {" "}
                                {gameMode === 0
                                    ? "3-7 character words"
                                    : "7-14 character words"}
                                {" provided by "}
                            </Text>
                        }
                        <Text textAlign="center">
                            <Link href="https://wordfrequency.info" isExternal>
                                wordfrequency.info
                            </Link>
                        </Text>
                    </Box>
                    <Center>
                        <Button
                            onClick={() => {
                                if (gameMode === 0) {
                                    setGameMode(1);
                                } else {
                                    setGameMode(0);
                                }
                            }}
                            disabled={inProgress}
                        >
                            {" "}
                            Change mode{" "}
                        </Button>
                    </Center>
                </Stack>
            </Collapse>
            <Box
                backgroundColor={mainBoxBackgroundColor}
                w="100%"
                py={8}
                px={2}
                borderRadius={widthLargerThan800 ? "md" : "none"}
                textAlign={"center"}
                ref={wordBoxRef}
            >
                {gameStatus === 0 && (
                    <InfoBox
                        startGame={startGameCountdown}
                        gameIsReady={gameIsReady}
                    />
                )}
                {gameStatus === 1 && <CountdownBox startGame={startGame} />}
                {gameStatus === 2 && (
                    <>
                        <WordBox
                            word={blankedWord}
                            progress={currentWordNumber}
                            setPlayerData={setPlayerData}
                            enteredAnswer={enteredAnswer}
                        />
                        <Queue
                            numLeft={CHALLENGE_WORDS_NUMBER - currentWordNumber}
                            timesTried={
                                wordPlayerData[currentWord]?.numberTimesTried
                            }
                            skipWord={skipWord}
                            gameStatus={gameStatus}
                        />
                    </>
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
                    <Text> Type the missing characters below.</Text>
                    <CharacterInput
                        correctAnswer={correctAnswer}
                        inputRef={inputRef}
                        enteredAnswer={enteredAnswer}
                        setEnteredAnswer={setEnteredAnswer}
                        answerIsWrong={answerIsWrong}
                        skipWord={skipWord}
                    />
                    <Box>
                        {/* <MobileView>
                            <SkipButtonPortal>
                                <Flex>
                                    <Button
                                        onClick={() => skipWord()}
                                        disabled={gameStatus !== 2}
                                    >
                                        Skip
                                        
                                    </Button>
                                    <Spacer/>
                                    <Button
                                        onClick={() => skipWord()}
                                        disabled={gameStatus !== 2}
                                    >
                                        Skip
                                       
                                    </Button>
                                </Flex>
                            </SkipButtonPortal>
                        </MobileView> */}
                        <BrowserView>
                            <Button
                                onClick={() => skipWord()}
                                disabled={gameStatus !== 2}
                            >
                                Skip (or press space)
                            </Button>
                        </BrowserView>
                    </Box>
                </Stack>
            )}
            {gameStatus === 0 && (
                <Text textAlign="center" px={2}>
                    {" "}
                    Any correct filler characters will be accepted. For example,
                    for the word B _ _ T, both "O, A" and "E, A" will be
                    accepted.
                </Text>
            )}
            {gameStatus === 3 && (
                <EndedText
                    playerData={playerData}
                    wordPlayerData={wordPlayerData}
                    
                />
            )}
        </Stack>
    );
};

export default React.memo(Challenge);

const SkipButtonPortal: React.FC = ({ children }) => {
    return ReactDOM.createPortal(
        children,
        document.getElementById("skip-btn-container") || document.body
    );
};
