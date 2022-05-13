import {
    Box,
    Button,
    Heading,
    SimpleGrid,
    Stack,
    Text,
} from "@chakra-ui/react";
import Counter from "../animated/Counter";
import { PlayerData, ProgressData } from "./Challenge";

const EndedText: React.FC<{
    playerData: PlayerData;
    wordPlayerData: { [key: string]: ProgressData };
}> = ({ playerData, wordPlayerData }) => {
    /* Calculate final score */
    // Score should be calculated as follows
    // 1. For each word, taking into account a) word length, b) number of missing characters, c) time taken, d) number of tries
    //     a. Word length: 5 points for each character in the word
    //     b. Number of missing characters: 25 points for each missing character
    //     c. Time bonus: 10 points for every second under 5 seconds
    //        Alternatively, 1 point every 1/10 second under 5 seconds
    //        Maximum time bonus: 50 points
    //     d. Number of tries: Subtract 10 points for each try over 3 tries, capped at 50 points subtracted
    //     d2.Alternatively, sync up with stickman
    //        a) Stickman alive: 50 points
    //        b) Stickman dead: 0 points
    //        c) Stickman has 5 limbs (left/right hand, left/right leg, half torso), each limb missing is -10 points
    // 2. If the word is skipped, no points awarded

    const calculateWordScore = (wordData: ProgressData): number => {
        if (wordData.skipped) return 0;
        const wordLength = wordData.word.length;
        const numberMissingCharacters = wordData.numberMissingCharacters;

        const tries = wordData.numberTimesTried;

        const timeTakenInTenths = Math.round(wordData.timeTaken / 100);
        const timeDifference = 50 - timeTakenInTenths;
        let timeBonus = 0;
        if (timeDifference < 0) {
            // Person took more time than 5 seconds, therefore no additional points
        } else {
            timeBonus = timeDifference;
        }

        const triesOverLimit = tries - 3;
        let triesPenalty = 0;
        if (tries > 0) {
            // tried too many times
            triesPenalty = triesOverLimit * 10 > 50 ? 50 : triesOverLimit * 10;
        }

        const points =
            5 * wordLength +
            25 * numberMissingCharacters +
            timeBonus -
            triesPenalty;
        return points;
    };

    const totalScore = Object.keys(wordPlayerData).reduce(
        (acc, word) => acc + calculateWordScore(wordPlayerData[word]),
        0
    );

    return (
        <Stack textAlign={"center"} spacing={3}>
            <Text>Congratulations! Your score is</Text>
            <Box>
                <Heading fontSize="6xl">
                    <Counter from={0} to={totalScore} />
                </Heading>
                {/* <Box>
                    <Text fontSize={"sm"} fontWeight="light"  display="inline-block" mr={1}>
                        That's better than
                    </Text>
                    <Counter from={0} to={75}  />
                    <Text fontSize={"sm"} fontWeight="light"  display="inline-block">
                        % of players!
                    </Text>
                </Box> */}
            </Box>
            <SimpleGrid columns={2} spacing={6} fontSize="xl">
                <Box textAlign="right">
                    <Text>You took</Text>
                </Box>
                <Box textAlign="left">
                    <Text fontWeight="semibold">{playerData.timeTaken}s</Text>
                </Box>
                <Box textAlign="right">
                    <Text>Correct words</Text>
                </Box>
                <Box textAlign="left">
                    <Text fontWeight="semibold">
                        {playerData.wordsCorrect.length}
                    </Text>
                </Box>
                <Box textAlign="right">
                    <Text>Skipped words</Text>
                </Box>
                <Box textAlign="left">
                    <Text fontWeight="semibold">
                        {playerData.wordsSkipped.length}
                    </Text>
                </Box>
            </SimpleGrid>
            <Box textAlign="center">
                <Button colorScheme="blue"> Share your score! </Button>
            </Box>

            <Box>
                <Heading fontSize="lg"> Correct words </Heading>
                <Text>{playerData.wordsCorrect.join(", ")}</Text>
            </Box>
            <Box>
                <Heading fontSize="lg"> Skipped words </Heading>
                <Text>{playerData.wordsSkipped.join(", ")}</Text>
            </Box>
        </Stack>
    );
};

export default EndedText;
