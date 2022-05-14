import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "system",
    useSystemColorMode: false,
    
};

const theme = extendTheme({
    fonts: {
        heading: "Roboto Mono, sans-serif",
        // body: 'Raleway, sans-serif',
    },
    config,
});

export default theme;
