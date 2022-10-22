import "../styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme/customTheme";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>      
        <Provider store={store()}>
          <Component {...pageProps} />      
        </Provider>
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default MyApp;