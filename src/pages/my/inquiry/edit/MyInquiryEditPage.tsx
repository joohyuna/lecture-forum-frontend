import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import { useEffect, useState } from "react";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import { useNavigate, useParams } from "react-router";
import {
    FormWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../../components/post/post.style.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import { AdminButtonGroup } from "../../../../components/admin/admin.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function MyInquiryEditPage() {
    // 사용자 측 "수정" 화면을 만들어야 해
    // 화면에서 받아서 전달해야 되는 경로 : title, content (req.body)
    //          => schema 가 필요하구나 =>
    // 문의 글 번호 : inquiryId (req.params)
    // 백엔드에게 요청해서 내용을 불러오고 => API를 만들어야 되는 구나
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // 구조분해할당 할때 동일한 이름을 붙여서 변수를 만들어야함
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const id = Number(inquiryId);

    const {
        register,
        handleSubmit, // 키보드를 사용자가 누를때 마다 이미 state 에 즉각 넣어준다.검증 후
        reset, // 이 화면은 수정 화면 => input 현재 글 정보를 불러와서 넣어줘야 됨
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(inquirySchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadInquiry = async () => {
            try {
                const result = await inquiryApi.getMyInquiryById(id);
                reset({
                    title: result.title,
                    content: result.content,
                });
            } catch (error) {
                console.log(error);
                alert("문의글을 불러오느데 실패하였습니다. 다시 시도하여 주세요");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };
        loadInquiry().then(() => {});
    }, [id, navigate, reset]);

    const onSubmit = async (data: InquiryInputType) => {
        try {
            await inquiryApi.updateInquiry(id, data);
            navigate(`/my/inquiry/${id}`);
        } catch (error) {
            console.log(error);
            alert("문의 글 수정 중 오류가 발생되었습니다.");
        }
    };

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>데이터를 불러오는 중입니다.</LoadingText>
            </PostContainer>
        );
    }

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의수정 <small></small>
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

export default MyInquiryEditPage;
