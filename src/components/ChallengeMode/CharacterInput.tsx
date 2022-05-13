import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import React, { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

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
    console.log("DEBUG: CHARACTERINPUT.tsx is RERENDERING!");
    if (inputRef.current && !enteredAnswer.length) inputRef.current.focus();

    const onChange = (e: string) => {
        setEnteredAnswer(e.toLowerCase().split(""));
    };

    // Doesn't work on mobile!!!
    const onSpacePressed = (e: React.KeyboardEvent<HTMLInputElement>) => {        
        if (e.key === " ") {
            // spacebar was pressed, skip
            skipWord();
        }
    };
    // Note: the error border won't be shown if the pininput is focused. Hence, we have to change the focusBorderColor if there is an error.
    return (
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
                        onKeyDown={onSpacePressed}                       
                        ref={index === 0 ? inputRef : undefined}
                        key={index}
                    />
                ))}
            </PinInput>
        </HStack>
    );
};

export default React.memo(CharacterInput);
