import * as React from "react";
import {
    ChakraProvider,
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
 
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import Nav from "./components/Navbar";
import Challenge from "./components/ChallengeMode/Challenge";
import theme from './theme'
export const MAX_WIDTH = 800

export const App = () => (
    <ChakraProvider theme={theme}>
        <Nav />
        <Box maxW={MAX_WIDTH} margin="auto" mt={6}> 
            <Challenge/>
        </Box>
    </ChakraProvider>
);
