// 이미 재정의 타입은 우리가 필요해서 재정의
// 실행될때 자동으로 불러와 진다.
import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            background: {
                default: string;
                paper: string;
            };
            text: {
                default: string;
                disabled: string;
            };
            divider: string;
            primary: string;
            secondary: string;
            success: string;
            error: string;
            warning: string;
            info: string;
        };
    }
}
