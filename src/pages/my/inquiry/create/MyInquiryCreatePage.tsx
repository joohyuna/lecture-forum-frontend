import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import { useForm } from "react-hook-form";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import {
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../../components/post/post.style.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import { AdminButtonGroup } from "../../../../components/admin/admin.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function MyInquiryCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(inquirySchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: InquiryInputType) => {
        try {
            const result = await inquiryApi.createInquiry(input);

            // 이 사람이 등록을 요청했을 때, 등록을 한 후, 지금 등록된 그 문의 글 상세 페이지 이동 시키려면
            // 문의 ID 가 필요함, 그걸 위해서는 inquiryApi.createInquiry()를 한 결과를 받아놔야 됨
            // 글 상세로 가게 됨
            navigate(`/my/inquiry/${result.id}`);
        } catch (error) {
            console.log(error);
            alert("게시글 등록에 실패했습니다.");
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의 등록 <small>빠른 시간 안에 답변드리도록 노력하겠습니다.</small>
                </PostTitle>
            </PostPageHeader>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    label={"문의 제목"}
                    id={"title"}
                    placeholder={"문의사항의 제목을 입력해주세요"}
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />
                <TextareaGroup
                    label={""}
                    id={"content"}
                    placeholder={"발생된 문제점에 대해 자세히 입력해주세요."}
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                />

                <AdminButtonGroup>
                    <Button color={"primary"} variant={"text"} onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        type={"submit"}
                        disabled={isSubmitting}>
                        등록
                    </Button>
                </AdminButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default MyInquiryCreatePage;
