import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../../components/admin/admin.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function MyInquiryDetailPage() {
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadInquiries = async () => {
            try {
                const result = await inquiryApi.getMyInquiryById(Number(inquiryId));
                setInquiry(result);
            } catch (error) {
                console.error(error);
                alert("문의 글을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInquiries().then(() => {});
    }, [inquiryId]);


    const handleDelete = async () => {
        // 백엔드에 삭제 요청을 하는 함수
        try {
            await inquiryApi.deleteInquiry(Number(inquiryId));
            alert("문의글 삭제가 완료 되었습니다.");
            navigate("/my/inquiry");
        } catch (error) {
            console.error(error);
            alert("문의 글 삭제를 진행 중 오류가 발생되었습니다.");
        }
    }

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>글 내용을 불러오는 중입니다....</LoadingText>
            </PostContainer>
        );
    }

    if (!inquiry) return;

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{inquiry.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                {new Date(inquiry.createdAt).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>
                <DetailContent>{inquiry.content}</DetailContent>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                    {!inquiry.answer && (
                        <>
                            <Button
                                color={"warning"}
                                variant={"contained"}
                                onClick={() => navigate(`/my/inquiry/edit/${inquiry.id}`)}>
                                수정
                            </Button>
                            <Button color={"error"} variant={"contained"} onClick={handleDelete}>
                                삭제
                            </Button>
                        </>
                    )}
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default MyInquiryDetailPage;
