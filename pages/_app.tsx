import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./../components/layout/theme";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CookiesProvider>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </CookiesProvider>
    );
}

export default MyApp;
