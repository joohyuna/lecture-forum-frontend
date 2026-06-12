import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../../components/post/post.style.tsx";
import { AdminButtonGroup, AnswerSection } from "../../../../components/admin/admin.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import AdminInquiryAnswerForm from "../../../../components/inquiry/AdminInquiryAnswerForm.tsx";
import AdminInquiryAnswerBox from "../../../../components/inquiry/AdminInquiryAnswerBox.tsx";

function AdminInquiryDetailPage() {
    // 글의 내용을 받아와서
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // router 의 id 임
    const { id } = useParams<{ id: string }>();
    const inquiryId = Number(id);

    useEffect(() => {
        const loadInquiry = async () => {
            try {
                const data = await adminInquiryApi.getInquiryById(Number(id));
                setInquiry(data);
            } catch (error) {
                console.error(error);
                alert("게시글을 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        }
        loadInquiry().then(() => {});
    }, [id, navigate]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>문의 내용을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    // notice가 Notice | null 이 허용되어 있는 state이기 때문
    if (!inquiry) return;

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{inquiry.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>{new Date(inquiry.createdAt).toLocaleString()}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>


                <DetailContent>{inquiry.content}</DetailContent>

                <hr />

                {/*
                    만약에, 답변에 아직 달리지 않았다면 Textarea를 띄워서 답변을 달 수 있도록 할 것이고
                    답변이 이미 달렸다면 답변 내용이 출력뒬수 있도록
                */}
                <AnswerSection>
                    {inquiry.answer ? (<AdminInquiryAnswerBox />) : (<AdminInquiryAnswerForm inquiryId={inquiryId} />)}
                </AnswerSection>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                    <Button
                        color={"warning"}
                        variant={"contained"}
                        onClick={() => navigate(`/admin/inquiry/update/${inquiry.id}`)}>
                        수정
                    </Button>
                    <Button color={"error"} variant={"contained"}>
                        삭제
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default AdminInquiryDetailPage;