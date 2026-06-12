import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState(false);

    // router 의 id 임
    const { id } = useParams<{ id: string }>();
    const inquiryId = Number(id);

    // useCallback(): React에서 제공하는 기능
    // loadInquiry는 useEffect 안에 있을 때에는 계속 새로운 애가 생성되는건데
    // 밖으로 뺐기 때문에 loadInquiry에는 유일한 애가 되었음
    // useCallback은 불러낼 때 이 안에 넣은 삼수가 재생되는걸 결정하는 의존성 배경

    // useEffect: 초기 랜더링에 끝난 이후에 1회 무조건 실행
    //          : 의존성 배열에 존재하는 값이 변경이 될 경우, 제실행

    // useCallback: 최초에 함수가 생성되어 메모리에 저장
    //             : 의존성 배열에 존재하는 값이 변경이 될 경우, 함수를 재생성

    // loadInquiry라고 작성한 함수는, AdminInquiryDetailPage(부모 컴포넌트)가
    // 화면에 출력이 될 때 완성상태로 메모리에 적재되고
    // 그걸 계속 useEffect가 불러와서 쓰게 됨 -> 뭔가 상황이 바뀌었다는 걸의미
    // useCallback으로, 상황이 바뀐걸 반영해서 함수를 재생성해달라고 씀

    const loadInquiry = useCallback(async () => {
        try {
            const data = await adminInquiryApi.getInquiryById(inquiryId);
            setInquiry(data);
        } catch (error) {
            console.error(error);
            alert("게시글을 불러오는 중 오류가 발생했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [inquiryId, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [id, loadInquiry, navigate]);

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
                    {inquiry.answer && !isEdit ? (
                        <AdminInquiryAnswerBox
                            inquiry={inquiry}
                            reload={loadInquiry}
                            setIsEdit={setIsEdit}
                        />
                    ) : (
                        <AdminInquiryAnswerForm inquiry={inquiry} reload={loadInquiry} isEdit={isEdit} setIsEdit={setIsEdit}/>
                    )}
                </AnswerSection>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default AdminInquiryDetailPage;
