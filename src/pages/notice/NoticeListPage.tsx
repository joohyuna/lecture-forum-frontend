import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import type { Notice } from "../../types/notice.type.ts";
import noticeApi from "../../api/user/noticeApi.ts";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../components/post/post.style.tsx";
import Pagination from "../../components/common/pagination/Pagination.tsx";

function NoticeListPage() {
    // req.param (X)
    // req.query  (page - 선택값)
    // user     (X)

    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 10;

    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const totalPage = Math.ceil(total / size);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    useEffect(() => {
        const loadList = async () => {
            try {
                const data = await noticeApi.getNoticeList(page, size);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.log(error);
                alert("공지사항을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        window.scrollTo({ top: 0, behavior: "smooth" });
        loadList().then(() => {});
    }, [page, size]);

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    공지사항 <small>총 {total}개의 글</small>
                </PostTitle>
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>게시글을 불러오는 중입니다.</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width={"10%"}>번호</BoardTh>
                                <BoardTh $width={"70%"}>제목</BoardTh>
                                <BoardTh $width={"20%"}>작성일</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ padding: "100px 0" }}>
                                        등록된 공지사항이 없습니다.
                                    </td>
                                </tr>
                            )}
                            {list.map(item => (
                                <tr key={item.id}>
                                    <BoardTd>{item.id}</BoardTd>
                                    <BoardTd className={"title-cell"}>
                                        <Link to={`/notice/${item.id}`}>{item.title}</Link>
                                    </BoardTd>
                                    <BoardTd>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </BoardTd>
                                </tr>
                            ))}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            <Pagination currentPage={page} totalPage={totalPage} onPageChange={handlePageChange} />
        </PostContainer>
    );
}

export default NoticeListPage;
