import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./../components/layout/theme";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { store } from "./../Redux/store";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CookiesProvider>
            <Provider store={store}>
                <ChakraProvider theme={theme}>
                    <Component {...pageProps} />
                </ChakraProvider>
            </Provider>
        </CookiesProvider>
    );
}

export default MyApp;
