import { RouterProvider } from "react-router";
import GetRouter from "./router/GetRouter.tsx";
import { darkTheme, lightTheme } from "./styles/theme.ts";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";
import { ThemeProvider } from "styled-components";
import { useThemeStore } from "./stores/theme/themeStore.ts";
import AuthProvider from "./providers/auth/AuthProvider.tsx";

function App() {
    const { theme } = useThemeStore();

    // localStorage는 브라우저에 저장하는 저장소 비휘발성(삭제를 하기 전까지 삭제되지 않음)
    // localStorage는 자동으로 되는 부분이 하나도 없음
    // provider 는 데이터제공 또는 기능제공
    // App에서 프로그램이 시작될때 그래서 RouterProvider 전에 한번 검증 하기
    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <GlobalStyle />
            <AuthProvider>
                <RouterProvider router={GetRouter}></RouterProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
