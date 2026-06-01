import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Props = {
    currentPage: number; // 지금현재 페이지 넘버
    totalPage: number; // 총 페이지 매수
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
};

function Pagination({ currentPage, totalPage, onPageChange, maxVisiblePages = 5 }: Props) {
    if (totalPage <= 1) {
        return null;
    }

    // 현재 페이지가 속한 블록 구현
    const currentBlock = Math.ceil(currentPage / maxVisiblePages);
    // 13번 페이지를 보고 있는데 maxVisiblePages 5개 라고 했다면
    // 13 / 5  = 올림하면 3
    // 블록 구성은 1 ~ 5, 6 ~ 10, 11 ~ 15로 되므로 3번 블록에 속한다가 됨
    const startPage = (currentBlock - 1) * maxVisiblePages + 1; // 예시 11번 페이지가 시작이구나
    // Math.min() 매개변수에 제공되는 숫자들 중에 작은 값을 구햐는 메서드
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPage); // 예시 15번째 페이지가 되는 구나 , 둘중에 작은것을 선택

    const pageNumber = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumber.push(i); // [11, 12, 13, 14, 15]
    }
    return (
        <PaginationContainer>
            <ArronButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                <FiChevronLeft size={18} />
            </ArronButton>
            {pageNumber.map(item => (
                <PageNumberButton
                    key={item}
                    $isActive={item === currentPage}
                    onClick={() => onPageChange(item)}>
                    {item}
                </PageNumberButton>
            ))}
            <ArronButton
                disabled={currentPage === totalPage}
                onClick={() => onPageChange(currentPage + 1)}>
                <FiChevronRight size={18} />
            </ArronButton>
        </PaginationContainer>
    );
}

export default Pagination;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 32px;
`;

const PageNumberButton = styled.button<{ $isActive: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 6px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid
        ${props => (props.$isActive ? props.theme.colors.primary : props.theme.colors.divider)};
    background-color: ${props =>
        props.$isActive ? props.theme.colors.primary : props.theme.colors.background.paper};
    color: ${props => (props.$isActive ? "#FFFFFF" : props.theme.colors.text.default)};
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        ${props =>
            !props.$isActive &&
            `
        background-color: ${props.theme.colors.background.default};
        color: ${props.theme.colors.primary};
        `}
    }
`;

const ArronButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 6px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid ${props => props.theme.colors.divider};
    background-color: ${props => props.theme.colors.background.paper};
    color: ${props => props.theme.colors.text.default};
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.theme.colors.background.default};
        color: ${props => props.theme.colors.primary};
    }
    &:disabled {
        color: ${props => props.theme.colors.text.disabled};
        background-color: ${props => props.theme.colors.background.paper};
        border-color: ${props => props.theme.colors.divider};
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
