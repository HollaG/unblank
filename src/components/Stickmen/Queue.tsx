import { Box } from "@chakra-ui/react";
import React from "react";

const Queue: React.FC<{
    numLeft: number;
}> = ({numLeft}) => {
    const stickMenToDisplay = numLeft > 10 ? 10 : numLeft;
    return <Box height="50px">
        {Array.from(Array(stickMenToDisplay).keys()).map((i) => (
            <Box key={i} width="50px" height="50px" bg="gray.300" borderRadius="50%" />
        ))}

    </Box>;
};

export default React.memo(Queue);
