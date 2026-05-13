import { RouterProvider } from "react-router";
import GetRouter from "./router/GetRouter.tsx";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/theme.ts";
import { GlobalStyle } from "./styles/GlobalStyle.tsx";
import { useEffect, useState } from "react";
import { ThemeContext, type ThemeType } from "./contexts/theme/ThemeContext.ts";

function App() {
    // localStorage는 브라우저에 저장하는 저장소 비휘발성(삭제를 하기 전까지 삭제되지 않음)
    // localStorage는 자동으로 되는 부분이 하나도 없음
    const [theme, setTheme] = useState<ThemeType>(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
    });

    const onChangeTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, onChangeTheme }}>
            <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <GlobalStyle />
                <RouterProvider router={GetRouter}></RouterProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default App;
