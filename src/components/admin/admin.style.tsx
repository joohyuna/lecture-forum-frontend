import styled from "styled-components";

export const AdminContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

export const AdminPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

export const AdminTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
`;

export const AdminLoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${props => props.theme.colors.text.disabled};
`;

// PC에서는 상관 없는데, 모바일 때문에 한번
export const AdminTableWrapper = styled.div`
    overflow-x: auto;
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const AdminTh = styled.th<{ $width?: string }>`
    width: ${props => props.$width};
    text-align: left;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.disabled};
    font-size: 13px;
    font-weight: 600;
    border-bottom: 2px solid ${props => props.theme.colors.divider};
`;

export const AdminTd = styled.td`
    // td는 flex를 쓸수 없음
    // 그안에 들어가는 요소는 대한 정렬은  text-align, vertical-align를 통해서 해야함
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid ${props => props.theme.colors.divider};
    vertical-align: middle;
`;

export const AdminForm = styled.form<{ $wrap?: boolean }>`
    display: flex;
    flex-direction: ${props => props.$wrap ? "row" : "column"};
    flex-wrap: ${props => props.$wrap ? "wrap" : "nowrap"};
    gap: 32px;
`;

// 매번 props에 대한 함수를 props => 로 써줬었던 것을
// 그렇게 만드는 함수의 매개변수가 1개이기 때문에 (props) => 에서 소괄호를 생략됐던것
// 그렇게 들어오는 props.$align의 기본값을 설정해주기 위해서
// 소괄호를 생략하지 않고 (props) =>를 써줘야 되며,
// 구조분해할당을 통해 ({$align}) => 를 써줘야함
export const AdminButtonGroup = styled.div<{ $align?: "left" | "right" | "center" }>`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: ${({ $align = "right" }) =>
        $align === "right" ? "flex-end" : $align === "center" ? "center" : "flex-start"};
`;

export const AnswerSection = styled.div`
margin-top: 32px;
    padding: 24px;
    background-color: ${props => props.theme.colors.background.default};
    border-radius: 8px;
    
    .status-badge {
        margin-right: 12px;
        vertical-align: middle;
    }
`;

export const AnswerDisplay =styled.div`
    display: flex;
    flex-direction: column;
    
    .answer-content {
        padding-top: 16px;
    }
`;

export const AnswerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid  ${props => props.theme.colors.divider};
    padding-bottom: 16px;
    
    h4 {
        font-size: 16px;
        color: ${props => props.theme.colors.primary};
        font-weight: 500;
    }
    
    small {
        color: ${props =>  props.theme.colors.secondary};
        font-size: 14px;
    }
`;

export const AnswerContent = styled.div`
 padding: 32px 0;
    line-height: 1.8;
    white-space: pre-wrap;
    word-wrap: break-all;
`;
