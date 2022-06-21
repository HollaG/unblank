import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import AnimatedProgress from "../animated/AnimatedProgress";
import { CHALLENGE_WORDS_NUMBER, PlayerData } from "./Challenge";

const WordBox: React.FC<{
    word: string;
    progress: number;
    setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
    enteredAnswer: string[];
}> = ({ word, progress, setPlayerData, enteredAnswer }) => {

    const [timeTaken, setTimeTaken] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeTaken((prevState) => (prevState = prevState + 1));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress === CHALLENGE_WORDS_NUMBER) {
            setPlayerData((prevState) => ({
                ...prevState,
                timeTaken: timeTaken,
            }));
        }
    }, [progress, setPlayerData, timeTaken]);

    // Change the 'your word is' to include the chars that the user entered\
    let [displayWord, setDisplayWord] = useState(word);
    useEffect(() => {
        let displayWordArray = word.split(" ");
        let displayWordFinalArray: string[] = [];
        let unknownCharNum = 0;
        displayWordArray.forEach((char) => {
            if (char === "_") {
                if (enteredAnswer[unknownCharNum]) {
                    // user entered this unknown character
                    displayWordFinalArray.push(
                        `<u>${enteredAnswer[unknownCharNum]}</u>`
                    );
                    unknownCharNum++;
                } else {
                    // user didn't enter this unknown character
                    displayWordFinalArray.push(`<u> </u>`); // EN space U+2002. Use this as it has the same width
                }
            } else {
                displayWordFinalArray.push(char);
            }
        });

        setDisplayWord(
            displayWordFinalArray.join(
                `<span style="margin-right: 4px"></span>`
            )
        );
    }, [word, enteredAnswer]);

    return (
        <Stack>
            <Box px={4}>
                <AnimatedProgress
                    value={(progress / CHALLENGE_WORDS_NUMBER) * 100}
                />
            </Box>
            <Text>
                ({progress} / {CHALLENGE_WORDS_NUMBER}) Your word is:{" "}
            </Text>
            <Heading
                fontSize="3xl"
                dangerouslySetInnerHTML={{ __html: displayWord }}
                mt={2}
            ></Heading>
            <Text fontSize="sm"> Time taken: {timeTaken}s</Text>
        </Stack>
    );
};

export default React.memo(WordBox);
