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

const widthBreakpoints = {
    // base: '50px',
    // md: "75px"
}
const marginBreakpoints = {
    // base: '0px',
    // md: "-12.5px"
}
const EndedStickmenList: React.FC<{
    wordPlayerData: { [key: string]: ProgressData };
}> = ({ wordPlayerData }) => {
    const invert = useColorModeValue("black", "white");
    // for skipped red color
    const skippedColor = useColorModeValue("red.500", "red.200");
    return (
        <Center>
            <SimpleGrid columns={{
                base: 4,
                sm: 6,
                md: 8,
                lg: 12
            }} width="fit-content" 
            spacing={{
                base: 2,
                sm: 2,
                md: 4,
                lg: 8
            }}
            >
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
                                <Box key={index} color={skippedColor} width="50px">
                                    <Stickman
                                        {...svgStyle}
                                        color={'skippedColor'}
                                    />
                                    <Text fontSize={"xs"}> {wordPlayerData[word].word} </Text>
                                </Box>
                            );
                        } else {
                            return (
                                <Box key={index} color={invert} width="50px">
                                    <Stickman
                                        {...svgStyle}
                                        color={invert}
                                    />
                                    <Text fontSize={"xs"}> {wordPlayerData[word].word} </Text>
                                </Box>
                            );
                        }
                    })}
            </SimpleGrid>
        </Center>
    );
};

export default EndedStickmenList;
