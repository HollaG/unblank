import { Heading, Progress, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AnimatedProgress from "../animated/AnimatedProgress";
import { CHALLENGE_WORDS_NUMBER, PlayerData } from "./Challenge";

const WordBox: React.FC<{
    word: string;
    progress: number;
    setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
}> = ({ word, progress, setPlayerData }) => {
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
    }, [progress]);

    return (
        <Stack>
            <AnimatedProgress
                value={(progress / CHALLENGE_WORDS_NUMBER) * 100}
            />
            <Text>
                ({progress} / {CHALLENGE_WORDS_NUMBER}) Your word is:{" "}
            </Text>
            <Heading mt={2}>{word}</Heading>
            <Text fontSize="sm"> Time taken: {timeTaken}s</Text>
        </Stack>
    );
};

export default WordBox;
