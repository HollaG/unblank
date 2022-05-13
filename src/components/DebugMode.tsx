import { Button, Flex, Heading, HStack, PinInput, PinInputField, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";

const DebugMode = () => {
    console.log("DEBUG: Rerendering!")
    const [input, setInput] = useState<string[]>(["1", "2", "3"]);
    const ref = useRef<HTMLInputElement>(null);
    const onChange = (e: string) => {
        setEnteredAnswer(e.toLowerCase().split(""));
    };
    const [enteredAnswer, setEnteredAnswer] = useState<string[]>([]);

    const focusFirstInput = () => {
        ref.current?.focus()
    }
    const increaseLength = () => {
        setInput((prevState) => {
            const length = prevState.length;
            const newLength = length + 1;
            const newState = Array.from(
                {
                    length: newLength,
                },
                (_, index) =>
                    index < length ? prevState[index] : "a"
            );

            return newState;
        })
    }
    const decreaseLength = () => {
        setInput((prevState) => {
            const length = prevState.length;
            const newLength = length - 1;
            const newState = Array.from(
                {
                    length: newLength,
                },
                (_, index) =>
                    index < length ? prevState[index] : "a"
            );

            return newState;
        })
    }
    return (
        <>
            <Heading>Test for when focus changes</Heading>{" "}
            <Stack>
                <Flex flexWrap={'wrap'}>
                    <Button
                        onClick={() =>
                            increaseLength()
                        }
                    >
                        {" "}
                        Increase length of input
                    </Button>
                    <Button
                        onClick={() =>
                            decreaseLength()
                        }
                    >
                        {" "}
                        Decrease length of input{" "}
                    </Button>
                </Flex>
                <Flex flexWrap={'wrap'}>
                    <Button onClick={() => focusFirstInput()}>Focus first input</Button>
                    <Button onClick={() => {
                        increaseLength()
                        focusFirstInput()
                    }}> Skip (increase length)</Button>
                    <Button onClick={() => {
                        decreaseLength()
                        focusFirstInput()
                    }}> Skip (decrease length)</Button>
                    <Button onClick={() => focusFirstInput()}> Skip (same length)</Button>
                </Flex>
                <HStack alignItems="center" justifyContent="center">
                    <PinInput
                        type="alphanumeric"
                        value={enteredAnswer.join("")}
                        onChange={onChange}
                      
                      
                    >
                        {input.map((char, index) => (
                            <PinInputField
                                ref={index === 0 ? ref : undefined}
                                key={index}
                            />
                        ))}
                    </PinInput>
                </HStack>
            </Stack>
        </>
    );
};

export default DebugMode;
