// Thank you to https://github.com/chakra-ui/chakra-ui/issues/68

import { Progress } from "@chakra-ui/react";


const AnimatedProgress: React.FC<{ value: number, transitionDuration?: number }> = ({ value, transitionDuration = 300 }) => {
   

    return (
        <Progress
            hasStripe
            value={value}
            size="sm"
            sx={{
                "& > div:first-of-type": {
                    transitionProperty: "width",
                    transitionDuration: `${transitionDuration}ms`,
                },
            }}
        />
    );
};

export default AnimatedProgress;
