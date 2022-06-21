import {
    Box,
    Button,
    Heading,
    
    Stack,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import Counter from "../animated/Counter";
import EndedStickmenList from "../Stickmen/EndedStickmenList";
import { PlayerData, ProgressData } from "./Challenge";
import domtoimage from "dom-to-image";
export const TRIES_BEFORE_PENALTY = 2;
const convertToImage = async (
    el: HTMLElement,
    imageFileName: string,
    bgcolor: string
) => {
    // const canvas = await html2canvas(el);
    // const dataUrl = canvas.toDataURL("image/png", 1.0);
    // const blob = await (await fetch(dataUrl)).blob();

    // return new File([blob], "results.png", { type: blob.type });

    const blob = await domtoimage.toBlob(el, {
        bgcolor,
    });

    return new File([blob], imageFileName, { type: blob.type });
};
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
    //     d. Number of tries: Subtract 10 points for each try over TRIES_BEFORE_PENALTY (3) tries, capped at 50 points subtracted
    //
    // 2. If the word is skipped, no points awarded

    const calculateWordScore = useCallback((wordData: ProgressData): number => {
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

        const triesOverLimit = tries - TRIES_BEFORE_PENALTY;
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
    }, []);

    let totalScore = 0;
    let totalTries = 0;
    Object.keys(wordPlayerData).forEach((word) => {
        let score = calculateWordScore(wordPlayerData[word]);
        wordPlayerData[word].points = score;
        totalScore += score;
        totalTries += wordPlayerData[word].numberTimesTried;
    });

    // for skipped red color
    const skippedColor = useColorModeValue("red.500", "red.200");

    // save score if score is higher than current high score
    const [previousHigh, setPreviousHigh] = useState(0);
    const [scoreState, setScoreState] = useState(0);
    // 0 - loading highscore
    // 1 - new highscore
    // 2 - new highscore (first time playing)
    // 3 - no new highscore

    const [fireConfetti, setFireConfetti] = useState(false);
    const [showConfettiCanvas, setShowConfettiCanvas] = useState(false);
    useEffect(() => {
        const previousHigh = localStorage.getItem("highscore");
        let parsedPreviousHigh = 0;
        let newScoreState = 0;
        if (!previousHigh || Number.isNaN(Number(previousHigh))) {
            // no previous high score / corrupt
            newScoreState = 2;
            localStorage.setItem("highscore", totalScore.toString());
        } else {
            parsedPreviousHigh = Number(previousHigh);
            if (totalScore > Number(previousHigh)) {
                localStorage.setItem("highscore", totalScore.toString());
                newScoreState = 1;
            } else {
                newScoreState = 3;
            }
        }

        // after the animation of the number counting up, set the previous high score
        const timeout = setTimeout(() => {
            setPreviousHigh(parsedPreviousHigh);
            setScoreState(newScoreState);
            if (newScoreState === 1 || newScoreState === 2) {
                setShowConfettiCanvas(true);
                setFireConfetti(true);
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [totalScore]);

    const bgcolor = useColorModeValue("white", "black");
    const share = useCallback(async () => {
        try {
            const image = await convertToImage(
                document.getElementById("capture") as HTMLElement,
                "share.png",
                bgcolor
            );
            const shareData: ShareData = {
                title: "Unblank",
                text: `I scored ${totalScore} points in Unblank!`,
                url: "https://unblank.me",
                files: [image],
            };
            await navigator.share(shareData);
        } catch (e) {
            console.log(e);
        }
    }, [bgcolor, totalScore]);

    return (
        <Stack textAlign={"center"} spacing={3}>
            <Box id="capture" py={3}>
                <Stack>
                    <Box>
                        <Text>Congratulations! Your score is</Text>
                        <Box position="relative">
                            <Heading fontSize="6xl" mt={0}>
                                <Counter from={0} to={totalScore} />
                            </Heading>
                            {showConfettiCanvas && (
                                <ReactCanvasConfetti
                                    style={{
                                        position: "absolute",
                                        top: -125,
                                        left: 0,
                                        right: 0,
                                        height: "450",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        maxWidth: "600px",
                                        width: "100%",
                                    }}
                                    // zIndex={100}
                                    fire={fireConfetti}
                                    startVelocity={15}
                                    spread={60}
                                    onDecay={() => setShowConfettiCanvas(false)}
                                />
                            )}
                        </Box>
                        <Box mt={2}>
                            {scoreState === 0 && <Text fontSize="sm">ㅤ</Text>}
                            {scoreState === 3 && (
                                <Text fontSize="sm">
                                    {" "}
                                    Previous highscore: {previousHigh}{" "}
                                </Text>
                            )}
                            {scoreState === 1 && (
                                <Text fontSize="sm">
                                    {" "}
                                    New highscore! Previous: {previousHigh}{" "}
                                </Text>
                            )}
                        </Box>                       
                    </Box>
                    <EndedStickmenList wordPlayerData={wordPlayerData} />
                    {/* <SimpleGrid columns={2} spacing={6} fontSize="xl">
                        <Box textAlign="right">
                            <Text>You took</Text>
                        </Box>
                        <Box textAlign="left">
                            <Text fontWeight="semibold">
                                {playerData.timeTaken}s
                            </Text>
                        </Box>
                        
                    </SimpleGrid> */}
                    <Text textAlign="center" fontSize="xl"> You took <b>{playerData.timeTaken}s</b></Text>                   
                </Stack>
            </Box>
            <Box textAlign="center">
                <Button colorScheme="blue" onClick={() => share()}>
                    {" "}
                    Share your score!{" "}
                </Button>
            </Box>

            {/* <Box>
                <Heading fontSize="lg"> Correct words </Heading>
                <Text>{playerData.wordsCorrect.join(", ")}</Text>
            </Box>
            <Box>
                <Heading fontSize="lg"> Skipped words </Heading>
                <Text>{playerData.wordsSkipped.join(", ")}</Text>
            </Box> */}

            <TableContainer>
                <Table variant="simple" size="sm">
                    <TableCaption>Detailed results</TableCaption>
                    <Thead>
                        <Tr>
                            <Th width={"40px"}>#</Th>
                            <Th>Word</Th>
                            <Th isNumeric>Blanks</Th>
                            <Th isNumeric>Tries</Th>
                            <Th isNumeric>Time</Th>
                            <Th isNumeric>Pts</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {Object.keys(wordPlayerData)
                            .sort(
                                (a, b) =>
                                    wordPlayerData[a].number -
                                    wordPlayerData[b].number
                            )
                            .map((word, index) => {
                                let isSkipped = wordPlayerData[word].skipped;
                                return (
                                    <Tr
                                        key={index}
                                        textColor={
                                            isSkipped ? skippedColor : "inherit"
                                        }
                                    >
                                        <Td>
                                            {wordPlayerData[word].number + 1}
                                        </Td>
                                        <Td>
                                            {wordPlayerData[word].word}{" "}
                                            {wordPlayerData[word].word !== word
                                                ? `(${word})`
                                                : ``}
                                        </Td>
                                        <Td isNumeric>
                                            {
                                                wordPlayerData[word]
                                                    .numberMissingCharacters
                                            }{" "}
                                            (
                                            {Math.round(
                                                (wordPlayerData[word]
                                                    .numberMissingCharacters /
                                                    word.length) *
                                                    100
                                            )}
                                            %)
                                        </Td>
                                        <Td isNumeric>
                                            {
                                                wordPlayerData[word]
                                                    .numberTimesTried
                                            }
                                        </Td>
                                        <Td isNumeric>
                                            {Math.round(
                                                wordPlayerData[word].timeTaken /
                                                    100
                                            ) / 10}
                                        </Td>
                                        <Td isNumeric>
                                            {wordPlayerData[word].points}
                                        </Td>
                                    </Tr>
                                );
                            })}
                    </Tbody>

                    <Tfoot>
                        <Tr>
                            <Td> </Td>
                            <Td> </Td>
                            <Td> TOTAL </Td>
                            <Td isNumeric> {totalTries}</Td>
                            <Td isNumeric> {playerData.timeTaken}</Td>
                            <Td isNumeric> {totalScore}</Td>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Stack>
    );
};

export default React.memo(EndedText);
