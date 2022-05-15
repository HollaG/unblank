import {
    Box,
    Flex,
    HStack,
    SimpleGrid,
    Spacer,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import stagefull from "../../assets/stickman/hanger-full.svg";
import stage1 from "../../assets/stickman/hanger-1.svg";
import stage2 from "../../assets/stickman/hanger-2.svg";
import stage3 from "../../assets/stickman/hanger-3.svg";
import stage4 from "../../assets/stickman/hanger-4.svg";
import stage5 from "../../assets/stickman/hanger-5.svg";
import stageempty from "../../assets/stickman/hanger-empty.svg";
import { calculateStickmanStage } from "../../utils/functions";
// async sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const images = [stagefull, stage1, stage2, stage3, stage4];
const Queue: React.FC<{
    numLeft: number;
    timesTried: number;
}> = ({ numLeft, timesTried }) => {
    const defaultStickMenToDisplay = numLeft > 10 ? 10 : numLeft;

    let stage = calculateStickmanStage(timesTried);
    // stage 1 to 5

    const [stickMenToDisplay, setStickMenToDisplay] = useState(
        defaultStickMenToDisplay
    );
    const [hangerSVG, setHangerSVG] = useState(`hanger-full`);
    const animateNext = async () => {
        // 1) set hanger to empty
        // 2) set last child to invisible
        // 3) spawn in a child animate shifting over to the middle
        // 3) replace hanger with full
        // 4) hide last child
        // 5) translate queue over x px
        // 6) change stickmenToDisplayNumber and reset translate
        setHangerSVG(`hanger`);
        await sleep(100);
        setHangerSVG(`hanger-full`);
        setStickMenToDisplay(stickMenToDisplay - 1);
    };

    const invert = useColorModeValue(false, true);

    // useEffect(() => {
    //     let newNum = (numLeft > 10) ? 10 : numLeft;
    //     animateNext()
    // }, [numLeft])
    return (
        // <Flex height="50px" justifyContent='center'>
        //     <HStack  spacing={0} flexDirection="row-reverse" flexWrap='nowrap'>
        //         {Array.from(Array(stickMenToDisplay).keys()).map((i) => (
        //             <Box
        //                 key={i}
        //                 width="50px"
        //                 height="50px"
        //                 bg="gray.300"
        //                 borderRadius="50%"
        //             />
        //         ))}
        //     </HStack>
        //     <Box width="50px" height="50px" bgColor="red">

        //     </Box>
        //     <Box w={'10'}></Box>
        // </Flex>
        <SimpleGrid
            columns={3}
            spacing={0}
            justifyContent="center"
            height="50px"
        >
            <Flex flexDirection="row-reverse" width="100%" overflow="visible">
                {/* <Box overflow={"visible"} whiteSpace="nowrap">
                    {Array.from(Array(stickMenToDisplay).keys()).map((i) => (
                        <Box
                            display="inline-block"
                            key={i}
                            width="50px"
                            // width="10%"
                            height="50px"
                            // bg="gray.300"
                            // borderRadius="50%"
                            marginRight={
                                i === stickMenToDisplay - 1 ? 0 : "-1.75rem"
                            }
                        >
                            <object
                                data="/stickman/stick-full.svg"
                                type="image/svg+xml"
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    // transform: "scale(1.5)",
                                }}
                            />
                        </Box>
                    ))}
                </Box> */}
            </Flex>
            <Box height="50px" margin="auto">
                <Box width="50px" height="50px">
                    {images.map((image, index) => (
                        <object
                            key={index}
                            data={image}
                            type="image/svg+xml"
                            style={{
                                position: "absolute",
                                height: "50px",
                                width: "50px",
                                // only hide if stage is greater than index
                                display: stage <= index ? "block" : "none",
                                filter: `invert(${invert ? "100" : "0"}%)`,
                            }}
                        />
                    ))}
                    {stage === 5 && (
                        <object
                            
                            data={stage5}
                            type="image/svg+xml"
                            style={{
                                position: "absolute",
                                height: "50px",
                                width: "50px",
                                // only hide if stage is greater than index
                               
                                filter: `invert(${invert ? "100" : "0"}%)`,
                            }}
                        />
                    )}
                    <object
                            
                            data={stageempty}
                            type="image/svg+xml"
                            style={{
                                position: "absolute",
                                height: "50px",
                                width: "50px",
                                // only hide if stage is greater than index
                               
                                filter: `invert(${invert ? "100" : "0"}%)`,
                            }}
                        />
                </Box>
            </Box>
        </SimpleGrid>
    );
};

export default React.memo(Queue);
