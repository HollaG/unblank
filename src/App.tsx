

import "./main.css";
import { ChakraProvider, Box } from "@chakra-ui/react";

import "@fontsource/roboto-mono/700.css";

import Nav from "./components/Navbar";
import Challenge from "./components/ChallengeMode/Challenge";
import theme from "./theme";

export const MAX_WIDTH = 800;

export const App = () => (
    <ChakraProvider theme={theme}>
        <Nav />
        <Box maxW={MAX_WIDTH} minHeight="100%" margin="auto">
            <Challenge />

            {/* <DebugMode/> */}
        </Box>
        <Box
            position="fixed"
            left={0}
            bottom={0}
            width="100%"
            id="skip-btn-container"
        ></Box>
    </ChakraProvider>
);
