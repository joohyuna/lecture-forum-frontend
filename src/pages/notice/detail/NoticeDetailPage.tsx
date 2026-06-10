import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Notice } from "../../../types/notice.type.ts";
import noticeApi from "../../../api/user/noticeApi.ts";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function NoticeDetailPage() {
    // req.params > 글번호
    // req.query > X
    // user        (X)
    // 관리자는 공지사항 수정, 삭제를 관리자 화면에서 진행 할거라
    // 여기, 사용자 측 공지사항 화면에서는 수정, 삭제 기능을 구현할 필요가 없음
    // 이 글을 읽는 사용자가 누군지 판별할 이유도 없음

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNotice = async () => {
            try {
                const data = await noticeApi.getNoticeById(Number(id));
                setNotice(data);
            } catch (error) {
                console.log(error);
                alert("공지사항을 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        loadNotice().then(() => {});
    }, [id, navigate]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>공지사항 내용을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    if (!notice) return;

    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{notice.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{notice.content}</DetailContent>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default NoticeDetailPage;
