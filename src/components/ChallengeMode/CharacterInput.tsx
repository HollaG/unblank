import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useCallback, useEffect } from "react";

const animationKeyframes = [1, -1, -3, 3, 1, -1, -3, 3, 1];

const CharacterInput: React.FC<{
    correctAnswer: string[];
    skipWord: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    enteredAnswer: string[];
    setEnteredAnswer: React.Dispatch<React.SetStateAction<string[]>>;
    answerIsWrong: boolean;
}> = ({
    correctAnswer,
    skipWord,
    inputRef,
    enteredAnswer,
    setEnteredAnswer,
    answerIsWrong,
}) => {    

    useEffect(() => {
        if (inputRef.current && !enteredAnswer.length) {
            console.log("Focusing input...");
            inputRef.current.focus();
        }
    }, [inputRef, enteredAnswer]);
    const onChange = useCallback(
        (e: string) => {
            setEnteredAnswer(e.toLowerCase().split(""));
        },
        [setEnteredAnswer]
    );

    // Doesn't work on mobile!!!
    const onSpacePressed = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === " ") {
                // spacebar was pressed, skip
                skipWord();
                e.preventDefault();
            }
        },
        [skipWord]
    );
    // Note: the error border won't be shown if the pininput is focused. Hence, we have to change the focusBorderColor if there is an error.

    let toAnimate = answerIsWrong;
    if (toAnimate) setTimeout(() => (toAnimate = false), 350);

    return (
        <motion.div
            animate={{ x: toAnimate ? animationKeyframes : 0 }}
            transition={{ duration: 0.3 }}
        >
            <HStack alignItems="center" justifyContent="center">
                <PinInput
                    type="alphanumeric"
                    value={enteredAnswer.join("")}
                    onChange={onChange}
                    isInvalid={answerIsWrong}
                    focusBorderColor={answerIsWrong ? "red.500" : "blue.500"}
                >
                    {correctAnswer.map((char, index) => (
                        <PinInputField
                            aria-label="Enter your answer"
                            autoComplete="off"
                            onKeyDown={onSpacePressed}
                            ref={index === 0 ? inputRef : undefined}
                            key={index}
                        />
                    ))}
                </PinInput>
            </HStack>{" "}
        </motion.div>
    );
};

export default React.memo(CharacterInput);
