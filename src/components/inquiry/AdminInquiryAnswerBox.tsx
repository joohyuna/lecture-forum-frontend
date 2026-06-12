import type { Inquiry } from "../../types/inquiry.type.ts";
import {
    AdminButtonGroup,
    AnswerContent,
    AnswerDisplay,
    AnswerHeader,
} from "../admin/admin.style.tsx";
import Button from "../common/button/Button.tsx";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";

interface Props {
    inquiry: Inquiry;
    reload: () => Promise<void>;
}

function AdminInquiryAnswerBox({ inquiry, reload }: Props) {
    const handleDeleteAnswer = async () => {
        try {
            await adminInquiryApi.deleteInquiryAnswer(inquiry.id);
            // 글 상세 내용을 다시 받아와야 함
            await reload();

        } catch (error) {
            console.log(error);
            alert ("관리자 답변 삭제 중 오류가 발생했습니다.");
        }
    }
    // 답변 내용이 출력되는 컴포넌트

    return (
        <AnswerDisplay>
            <AnswerHeader>
                <h4>답변자 관리</h4>
                <small>
                    답변일시 : {inquiry.answeredAt && new Date(inquiry.answeredAt).toLocaleString()}
                </small>
            </AnswerHeader>

            <AnswerContent className={"answer-content"}>{inquiry.answer}</AnswerContent>

            <AdminButtonGroup $align={"right"} style={{ marginTop: "24px" }}>
                <Button variant={"contained"} color={"warning"}>답변수정</Button>
                <Button variant={"contained"} color={"error"} onClick={handleDeleteAnswer}>답변삭제</Button>
            </AdminButtonGroup>
        </AnswerDisplay>
    );
}

export default AdminInquiryAnswerBox;
