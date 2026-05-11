import styled from "styled-components";
import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

export type ButtonColorType = "primary" | "secondary" | "success" | "error" | "warning" | "info";
export type ButtonVariantType = "contained" | "text" | "icon";

const StyledButton = styled.button<{ $color: ButtonColorType; $variant: ButtonVariantType }>`
    font-size: 14px;
    font-weight: 600;
    color: ${props => (props.$variant === "contained" ? "#ffffff" : "inherit")};
    background-color: ${props =>
        props.$variant === "contained" ? props.theme.colors[props.$color] : "transparent"};
    padding: ${props => props.$variant === "icon" ? "8px" : "8px 12px"};
    border-radius: ${props => props.$variant === "icon" ? "50%" : "6px"};
    transition: all 0.5s;
    &:hover {
        filter: brightness(0.8);
        background-color: ${props =>
            props.$variant === "contained" ? undefined : props.theme.colors.background.default };
    }
`;

// 우리가 만든 Button컴포넌트는 button태그처럼 사용할거야
// 그러니까 button태그가 받을수 잇는 속성은 다 허용해줘 => 상속을 이용 (interface)
// button 태그의 타입: ButtonHTMLAttributes<HTMLButtonElement>

// 즉, 우리가 만든 Button 컾포넌트는 button의 확장판이다.
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    color: ButtonColorType;
    variant: ButtonVariantType;
    as?: ElementType,
    to?: string;
    // Button 컴포넌트가 받아야 되는 내용의 타입
};
function Button({ children, color, variant, ...props }: Props) {
    // 실제 내용이 들어오는 자리
    return (
        <StyledButton $color={color} $variant={variant} {...props as any} >
            {children}
        </StyledButton>
    );
}

export default Button;
