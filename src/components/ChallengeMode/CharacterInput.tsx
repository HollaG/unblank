import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const CharacterInput: React.FC<{
    correctAnswer: string[];
    setCorrectAnswer: React.Dispatch<React.SetStateAction<string[]>>;
    inputRef: React.RefObject<HTMLInputElement>
    enteredAnswer: string[],
    setEnteredAnswer: React.Dispatch<React.SetStateAction<string[]>>
    answerIsWrong: boolean,
}> = ({ correctAnswer, setCorrectAnswer, inputRef, enteredAnswer, setEnteredAnswer, answerIsWrong }) => {

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [correctAnswer, inputRef])

    const onChange = (e: string) => {
        setEnteredAnswer(e.split(""))
        
    }

    // Note: the error border won't be shown if the pininput is focused. Hence, we have to change the focusBorderColor if there is an error.
    return (
        <HStack alignItems="center" justifyContent="center">
            <PinInput type="alphanumeric" value={enteredAnswer.join("")} onChange={onChange} isInvalid={answerIsWrong} focusBorderColor={answerIsWrong ? "red.500" : "blue.500"}>
                {correctAnswer.map((char, index) => (
                    <PinInputField ref={index === 0 ? inputRef : undefined} key={index}/>
                ))}
                
            </PinInput>
        </HStack>
    );
};

export default CharacterInput;
