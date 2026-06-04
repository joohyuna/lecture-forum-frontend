import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../schemas/reply/createReplySchema.ts";
import {
    EmptyMessage,
    ReplyContainer,
    ReplyContent,
    ReplyForm,
    ReplyHeader,
    ReplyItem,
    ReplyList,
    ReplyTitle,
} from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import replyApi from "../../api/user/replyApi.ts";
import { useCallback, useEffect, useState } from "react";
import type { Reply } from "../../types/reply.type.ts";
import ReplyPagination from "../common/pagination/ReplyPagination.tsx";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    // 사용자가 댓글 내용을 입력하고, 그걸 백엔드에게 저장해 달라고 요청
    const { isLoggedIn, user } = useAuthStore();
    const [list, setList] = useState<Reply[]>([]);

    // 댓글 목록을 포함해야 하니, pagination도 해야되는구나, 근데 얠 queryString에 포함 시켜야 되나?
    // 사용자 목록 또는 글 목록을 할 때에는 페이지네이션 정보를 쿼리스트링에 포함했었음
    // 근데 지금 보면, PostReply 라고 하는 컴포넌트는 PostDetailPage의 하위 컴포넌트로 구성 되어져 있음
    // 결국 여기에서 쿼리스트링을 쓰면 /post/7?page=1&size=10 이러한 결과가 됨
    // 이렇게 해도됨
    // 근데 주소를 가지고 값을 따져보기엔 모호해짐, 즉, 이것 직관적이지 못 하다.
    // 그리고 쿼리스트링으로 관리하는 이유는 "뒤로가기" 때문에, 히스토리를 유지하지 위해 하는 것
    // 여기에서의 내 판단은 "글"이 중심이 되어야지 "댓글"이 중심이 아니다. 그래서 쿼리스트링 안 쓸 것임.

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0); // 총 댓글 갯수
    const size = 10;
    // 총 페이지  매수
    const totalPages = Math.max(1, Math.ceil(total / size));
    const [isLoading, setIsLoading] = useState(true);

    const loadReplies = useCallback(
        async (page: number) => {
            // 이 함수가 갖데 되는 "page" 변수는 부모가 갖고 있는 page state가 아니라 page 매겨변수가 됨.
            // 의존성 에서 page 삭제
            try {
                const result = await replyApi.getRepliesByPostId(postId, page, size);
                setList(result.list);
                setTotal(result.total);
                setPage(page);
            } catch (error) {
                console.log(error); // 댓글은 중요하지 않음 부속품임 따로 필요 없음 에러 메세지가
            } finally {
                setIsLoading(false);
            }
        },
        [postId],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadReplies(1).then(() => {});
    }, [loadReplies]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(createReplySchema),
        mode: "onBlur",
    });

    useEffect(() => {
        reset({
            postId,
        });
    }, [postId, reset]);

    // submit을 하는데 zod가 "너 postId 없는데?" 라서 진행이 안 됐던 것
    // postId는 PostReply 컴포넌트가 Props를 통ㅇ해 전달을 받고 있는데
    // 그 값이 react-hook-form이 관리학소 있는 state에 기록이 안돼서
    // 그래서 그걸 postId의 값이 도착하면 useEffect가 발동하면서 react-hook-form의 state에 값을 넣어주도록 함

    const onSubmit = async (data: CreateReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset({
                postId,
                content: "",
            }); // textarea에 값이 입력되어져 있는 상태이기 때문에 그걸 비울려고
            // reset을 사용하지 않고, setValue 기능을 꺼내와서 setValue("content", "")
            await loadReplies(1);
            // 댓글을 불러오는 기능
            // 1. 내가 댓글을 작성하면 실행
            // 2. 글 내용을 보면, 이미 댓글 목록도 불러와졌어야 함
            // 2-1. 댓글 목록 먼저 불러와야함
        } catch (error) {
            console.log("댓글 작성 실패 : ", error);
            alert(" 댓글 작성중 오류가 발생했습니다.");
        }
    };

    const handleDeleteReply = async (replyId: number) => {
        if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) return;

        try {
            await replyApi.deleteReply(replyId);
            await loadReplies(1);

        } catch (error) {
            console.log("댓글 삭제 실패 : ", error);
            alert("댓글 삭제 중 오류가 발생되었습니다. ");
        }
    };

    return (
        <ReplyContainer>
            <ReplyTitle>
                <LuMessageSquare size={20} />
                댓글 <span className={"count"}>0</span>
            </ReplyTitle>
            <ReplyForm onSubmit={handleSubmit(onSubmit)}>
                <div style={{ flex: 1 }}>
                    <TextareaGroup
                        style={{ minHeight: "40px" }}
                        placeholder={
                            isLoggedIn
                                ? "토론에 대한 의견을 남겨주세요"
                                : "로그인 후 댓글을 작성할 수 있습니다."
                        }
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                        disabled={!isLoggedIn || isSubmitting}
                    />
                </div>

                <Button
                    color={isLoggedIn ? "primary" : "secondary"}
                    variant={"contained"}
                    type={"submit"}
                    style={{ minWidth: "100px" }}
                    disabled={!isLoggedIn || isSubmitting}>
                    {isSubmitting ? "등록 중..." : "댓글 등록"}
                </Button>
            </ReplyForm>

            <ReplyList>
                {isLoading ? (
                    <EmptyMessage>댓글을 불러오는 중입니다.</EmptyMessage>
                ) : list.length === 0 ? (
                    <EmptyMessage>가장 먼저 토론에 참여해 보세요</EmptyMessage>
                ) : (
                    list.map(item => (
                        <ReplyItem key={item.id}>
                            <ReplyHeader>
                                <div className={"author-info"}>
                                    <strong>{item.user.nickname}</strong>
                                    <span className={"date"}>
                                        {new Date(item.createdAt).toLocaleString("ko-KR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                {user?.id === item.userId && (
                                    <button
                                        className={"delete-btn"}
                                        onClick={() => handleDeleteReply(item.id)}>
                                        삭제
                                    </button>
                                )}
                            </ReplyHeader>
                            <ReplyContent>{item.content}</ReplyContent>
                        </ReplyItem>
                    ))
                )}
            </ReplyList>

            <ReplyPagination currentPage={page} totalPage={totalPages} onPageChange={loadReplies} />
        </ReplyContainer>
    );
}

export default PostReply;

// 우리는 댓글 요청을 백엔드에 해주려면