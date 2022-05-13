import * as React from "react";

import "./main.css"
import {
    ChakraProvider,
    Box,
    Button,
    
 
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import Nav from "./components/Navbar";
import Challenge from "./components/ChallengeMode/Challenge";
import theme from './theme'
import DebugMode from "./components/DebugMode";
export const MAX_WIDTH = 800

export const App = () => (
    <ChakraProvider theme={theme} >
        <Nav />
        <Box maxW={MAX_WIDTH} minHeight="100%" margin="auto"> 
            <Challenge/>

         {/* <DebugMode/> */}
        </Box>
        <Box position="fixed" left={0} bottom={0} width="100%" id="skip-btn-container"> 
           
        </Box>
    </ChakraProvider>
);
