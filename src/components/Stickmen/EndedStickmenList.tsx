import {
    Box,
    Center,
    SimpleGrid,
    useColorModeValue,
    Text,
} from "@chakra-ui/react";
import { ProgressData } from "../ChallengeMode/Challenge";
import { ReactComponent as StickFull } from "../../assets/stickman/stick-full.svg";

import { ReactComponent as Stick1 } from "../../assets/stickman/stick-1.svg";
import { ReactComponent as Stick2 } from "../../assets/stickman/stick-2.svg";
import { ReactComponent as Stick3 } from "../../assets/stickman/stick-3.svg";
import { ReactComponent as Stick4 } from "../../assets/stickman/stick-4.svg";
import { ReactComponent as Stick5 } from "../../assets/stickman/stick-5.svg";

import { calculateStickmanStage } from "../../utils/functions";
const svgStyle = {
    // height: "50px",
    // width: "50px",
    transform: "scale(1.5)",
};
const stages = [StickFull, Stick1, Stick2, Stick3, Stick4, Stick5];
const EndedStickmenList: React.FC<{
    wordPlayerData: { [key: string]: ProgressData };
}> = ({ wordPlayerData }) => {
    const invert = useColorModeValue("black", "white");
    // for skipped red color
    const skippedColor = useColorModeValue("red.500", "red.200");
    return (
        <Center>
            <SimpleGrid columns={{
                base: 6,
                md: 8,
                lg: 12
            }} width="fit-content">
                {Object.keys(wordPlayerData)
                    .sort(
                        (a, b) =>
                            wordPlayerData[a].number - wordPlayerData[b].number
                    )
                    .map((word, index) => {
                        const { numberTimesTried, skipped } =
                            wordPlayerData[word];
                        const stage = calculateStickmanStage(
                            numberTimesTried,
                            skipped
                        );

                        const Stickman = stages[stage];
                        if (skipped) {
                            return (
                                <Box key={index} color={skippedColor}>
                                    <Stickman
                                        {...svgStyle}
                                        color={'skippedColor'}
                                    />
                                    <Text fontSize={"xs"}> {word} </Text>
                                </Box>
                            );
                        } else {
                            return (
                                <Box key={index} color={invert}>
                                    <Stickman
                                        {...svgStyle}
                                        color={invert}
                                    />
                                    <Text fontSize={"xs"}> {word} </Text>
                                </Box>
                            );
                        }
                    })}
            </SimpleGrid>
        </Center>
    );
};

export default EndedStickmenList;
