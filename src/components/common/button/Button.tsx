import styled from "styled-components";
import type { ReactNode } from "react";

export type ButtonColorType = "primary" | "secondary" | "success" | "error" | "warning" | "info";

const StyledButton = styled.button<{$color: ButtonColorType}>`
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    background-color: ${props => props.theme.colors[props.$color]};
    padding: 8px 14px;
    border-radius: 6px;
    transition: all 0.5s;
    &:hover {
        filter: brightness(0.8);
    }
`;

type Props = {
    children: ReactNode;
    color: ButtonColorType;
    // Button 컴포넌트가 받아야 되는 내용의 타입
}
function Button({children, color}: Props) { // 실제 내용이 들어오는 자리
    return <StyledButton $color={color}>{children}</StyledButton>
}

export default Button;