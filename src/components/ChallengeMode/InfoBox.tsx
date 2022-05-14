import { Box, Button, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { CHALLENGE_WORDS_NUMBER } from "./Challenge";

const InfoBox: React.FC<{
    startGame: () => void;
    gameIsReady: boolean;
}> = ({ startGame, gameIsReady }) => {
    return (
        <Stack px={4}>
            <Text>
                Fill in the missing letters of the upcoming words correctly as
                fast as possible! Total of {CHALLENGE_WORDS_NUMBER} words will
                be shown - the faster & more words you fill, the higher your score.{" "}
            </Text>
            <Box>
                <Button
                    colorScheme="blue"
                    mt={4}
                    onClick={() => startGame()}
                    isLoading={!gameIsReady}
                >
                    Begin
                </Button>
            </Box>
        </Stack>
    );
};

export default React.memo(InfoBox);
