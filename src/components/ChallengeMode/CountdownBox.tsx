import { Heading, Progress, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AnimatedProgress from "../animated/AnimatedProgress";

const CountdownBox: React.FC<{ startGame: () => void }> = ({ startGame }) => {
    const [timer, setTimer] = useState(0);

    // // set an interval to count down to 0, then start the game
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTimer(timer - 1);
    //     }, 1000);
    //     if (timer === 0) {

    //         startGame()
    //         // setTimer(0)
    //         // clearInterval(interval);
    //     }
    //     return () => clearInterval(interval);
    // }, [timer, startGame]);

    useEffect(() => {
        let startTimestamp: number, previousTimeStamp: number;
        let done = false;
        const step = (timestamp: number) => {
            if (!startTimestamp) {
                startTimestamp = timestamp;
            }
            const elapsed = timestamp - startTimestamp;
            if (previousTimeStamp !== timestamp) {
                // Math.min() is used here to make sure the element stops at exactly 200px
                
                let progress = 100 - Math.floor((elapsed / 3000) * 100);
                setTimer(progress);
                if (progress <= 0) done = true;
            }
            if (elapsed < 3000) {
                // Stop the animation after 3 seconds
                previousTimeStamp = timestamp;
                !done && window.requestAnimationFrame(step);
            } else {
                done = true;
            }

            if (done) {
                startGame();
            }
        };
        const animation = requestAnimationFrame(step);
    }, [startGame]);

    return (
        <Stack>
            <AnimatedProgress value={timer} transitionDuration={50} />

            <Text> Get ready! The game will begin in </Text>

            <Heading> {Math.floor(timer / 30)}... </Heading>
        </Stack>
    );
};

export default CountdownBox;
