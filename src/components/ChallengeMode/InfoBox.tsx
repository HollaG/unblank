import { Button , Text } from "@chakra-ui/react";
import { CHALLENGE_WORDS_NUMBER } from "./Challenge";

const InfoBox:React.FC<{
    startGame: () => void
}> = ({startGame}) => {
    return (
        <>
            <Text>
                Fill in the missing letters of the upcoming words correctly as
                fast as possible! Total of {CHALLENGE_WORDS_NUMBER} words will be shown - the more
                words you fill, the higher your score.{" "}
            </Text>
            <Button colorScheme="blue" mt={4} onClick={() => startGame()}>
                Begin
            </Button>
        </>
    );
};

export default InfoBox;
