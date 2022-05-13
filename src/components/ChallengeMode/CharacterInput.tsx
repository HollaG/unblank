import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";

const CharacterInput: React.FC<{
    correctAnswer: string[];

    inputRef: React.RefObject<HTMLInputElement>;
    enteredAnswer: string[];
    setEnteredAnswer: React.Dispatch<React.SetStateAction<string[]>>;
    answerIsWrong: boolean;
}> = ({
    correctAnswer,

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
                        ref={index === 0 ? inputRef : undefined}
                        key={index}
                    />
                ))}
            </PinInput>
        </HStack>
    );
};

export default React.memo(CharacterInput);
