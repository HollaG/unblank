import { Heading, Progress, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AnimatedProgress from "../animated/AnimatedProgress";

const CountdownBox: React.FC<{ startGame: () => void }> = ({ startGame }) => {
    const [timer, setTimer] = useState(3);

    // set an interval to count down to 0, then start the game
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);
        if (timer === 0) {
         
            startGame()
            // setTimer(0)
            // clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, startGame]);

    return (
        <Stack>
            <AnimatedProgress value={timer / 3 * 100}/>
            
            <Text> Get ready! The game will begin in </Text>
    
            <Heading> {timer}... </Heading>
        </Stack>
    );
};

export default CountdownBox;
