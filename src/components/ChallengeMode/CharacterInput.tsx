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
    // This code is not in useEffect because if it was, every time the # of input field changes,
    // focus will be lost.
    if (inputRef.current && !enteredAnswer.length) {
        inputRef.current.focus();
    }

    // This part is in useEffect because the ref might not be set on first render,
    // i.e. when the user first clicks start game.
    // Without this code,
    // Expected behaviour: User clicks start game --> input field is focused
    // Actual behaviour: User clicks start game --> input field appears but is not focused --> only when game actually starts after countdown does input field get focused
    useEffect(() => {
        if (inputRef.current && correctAnswer[0] === "") {
            // we only want this to fire when correctAnswer === [""] (this is when the game is starting), but we can't compare arrays like this.
            inputRef.current.focus();
        }
    }, [inputRef, correctAnswer]);

    // Disallow entering any answers when correctAnswer = [""] (game hasn't started)
    const onChange = useCallback(
        (e: string) => {
            correctAnswer[0] !== "" &&
                setEnteredAnswer(e.toLowerCase().split(""));
        },
        [setEnteredAnswer, correctAnswer]
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
