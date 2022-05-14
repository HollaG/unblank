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
    components: {
        Button: {
            baseStyle: {
                zIndex: 1500
            }
        }
    },
    config,
});

export default theme;
