import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeType = "light" | "dark";

type ThemeState = {
    theme: ThemeType;
    onChangeTheme: VoidFunction;
};

export const useThemeStore = create<ThemeState>()(
    // persist는 이렇게 마련한 store와 localStorage를 연결하는 미들웨어
    // persist를 사용하면 localStorage에 자동 저장 /불러오기 기능에 추가됨

    // create<스토어의 타입>() (persist)
    // persist(초기값, localStorage의 설정)

    // 1. 초기값을 함수로 넣었고, (2. 스토어의 값을 바꿀수 있는 명령) => ({theme, onChangeTheme})
    persist(
        // 1.
        set => ({
            theme: "light",
            onChangeTheme: () =>
                set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        // 2.
        {
            name: "theme-storage",
        },
    ),
);

// export const useThemeStore = create<ThemeState>()()
// export const useThemeStore = create<ThemeState>()를하면 나오는 결과(함수)를 또 실행