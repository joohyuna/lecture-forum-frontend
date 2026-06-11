
import { useEffect, useState } from "react";
import type { Inquiry } from "../../../types/inquiry.type.ts";
import inquiryApi from "../../../api/user/inquiryApi.ts";
import { Link, useSearchParams } from "react-router";

import { BoardTable, BoardTd, BoardTh, BoardWrapper, LoadingText, PostContainer, PostPageHeader, PostTitle } from "../../../components/post/post.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx";

function MyInquiryListPage() {

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 20;

    const [list, setList] = useState<Inquiry[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadList = async () => {
            try {
                const data = await inquiryApi.getMyInquiryList(page, size);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.error(error);
                alert("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        loadList().then(() => {});
    }, [page, size]);

    const onPageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams); // 주소 변경
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    게시판 <small>총 {total}개의 글</small>
                </PostTitle>

                    <Button
                        color={"primary"}
                        variant={"contained"}
                        as={Link}
                        to={`/my/inquiry/create`}>
                        문의 남기기
                    </Button>

            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>게시글을 불러오는 중입니다.</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                        <tr>
                            <BoardTh $width={"10%"}>번호</BoardTh>
                            <BoardTh>제목</BoardTh>
                            <BoardTh $width={"15%"}>작성일</BoardTh>
                            <BoardTh $width={"10%"}>답변</BoardTh>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 && (
                            <tr>
                                <BoardTd
                                    colSpan={4}
                                    $align={"center"}
                                    style={{ padding: "100px 0" }}>
                                    아직 작성된 게시글이 없습니다. 첫 글을 남겨보세요
                                </BoardTd>
                            </tr>
                        )}
                        {list.map(item => (
                            <tr key={item.id}>
                                <BoardTd>{item.id}</BoardTd>
                                <BoardTd className={"title-cell"}>
                                    <Link to={`/my/inquiry/${item.id}`}>{item.title}</Link>
                                </BoardTd>
                                <BoardTd>
                                    {/*
                                            Date 클래스의 메서드 중 toLocaleString()은
                                            해당 날짜를 사용자의 지역 시간에 맞게 문자열로 변환하는 메서드
                                            매개변수를 생략하면 자동으로 보는 사용자에 맞춰 제공됨
                                            .toLocaleString(해당 지역, 옵션 객체)
                                        */}
                                    {new Date(item.createdAt).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </BoardTd>
                                <BoardTd>
                                    {item.answer ? "답변완료" : "답변대기"}
                                </BoardTd>
                            </tr>
                        ))}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            <Pagination currentPage={page} totalPage={totalPage} onPageChange={onPageChange} />
        </PostContainer>
    );;
}

export default MyInquiryListPage;
