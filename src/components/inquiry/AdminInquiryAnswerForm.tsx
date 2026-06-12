import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    type AdminInquiryAnswerInputType,
    adminInquiryAnswerSchema,
} from "../../schemas/admin/inquiry/admininInquiryAnswerSchema.ts";
import { AdminButtonGroup, AdminForm } from "../admin/admin.style.tsx";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";

interface Props {
    inquiryId: number;
    reload: () => Promise<void>;
}

function AdminInquiryAnswerForm({ inquiryId, reload }: Props) {
    // 답변을 다는 역할을 하려면

    // 글 등록 (생성) 을 생각하는 것과 동일

    // react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminInquiryAnswerInputType>({
        resolver: zodResolver(adminInquiryAnswerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: AdminInquiryAnswerInputType) => {
        try {
            await adminInquiryApi.updateInquiryAnswer(inquiryId, data);
            // 글 내용을 다시 불러오는 기능을 재실행
            await reload();
        } catch (error) {
            console.log(error);
            alert("답변 등록중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminForm onSubmit={handleSubmit(onSubmit)}>
            <TextareaGroup
                id={"answer"}
                label={"관리자 답변 작성"}
                placeholder={"사용자에게 전달할 답변을 상세히 작성해주세요"}
                errorMessage={errors.answer?.message}
                registerObj={register("answer")}
            />

            <AdminButtonGroup $align={"right"}>
                <Button type={"submit"} disabled={isSubmitting} color={"error"} variant={"text"}>
                    답변 등록
                </Button>
            </AdminButtonGroup>
        </AdminForm>
    );
}

export default AdminInquiryAnswerForm;
