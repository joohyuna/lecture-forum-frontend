import { RouterProvider } from "react-router";
import GetRouter from "./router/GetRouter.tsx";
import { darkTheme, lightTheme } from "./styles/theme.ts";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";
import { ThemeProvider } from "styled-components";
import { useThemeStore } from "./stores/theme/themeStore.ts";

function App() {
    const { theme } = useThemeStore();

    // localStorage는 브라우저에 저장하는 저장소 비휘발성(삭제를 하기 전까지 삭제되지 않음)
    // localStorage는 자동으로 되는 부분이 하나도 없음
    return (

            <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <GlobalStyle />
                <RouterProvider router={GetRouter}></RouterProvider>
            </ThemeProvider>

    );
}

export default App;
