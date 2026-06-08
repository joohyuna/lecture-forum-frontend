import {
    AdminButtonGroup,
    AdminContainer,
    AdminLoadingText,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import { useEffect, useState } from "react";
import type { Notice } from "../../../types/notice.type.ts";
import { Link, useSearchParams } from "react-router";
import Card from "../../../components/common/card/Card.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx";
import noticeApi from "../../../api/user/noticeApi.ts";
import { FiEdit, FiTrash } from "react-icons/fi";
import adminNoticeApi from "../../../api/admin/adminNoticeApi.ts";

function AdminNoticeLis_Met() {
    const [list, setList] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const SIZE = 20; // 고정값
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / SIZE); // Math.ceil() : 올림 메서드

    const loadNotices = async (page: number) => {
        try {
            const data = await noticeApi.getNoticeList(page, SIZE);
            setList(data.list);
            setTotal(data.total);
        } catch (error) {
            console.log(error);
            alert("게시판  목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });

        // 문법 오류
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadNotices(page).then(() => {});
    }, [page]);

    const handleDelete = async (id: number) => {
        // confirm은 사용자에게 경고차을 통해 확인을 받는 메서드, true/false가 반환됨
        // 그렇게 최소를 하면 더이상 함수 진행을 안함
        if (!confirm("정말 이 게시물을 하시겠습니까?")) {
            return;
        }

        try {
            await adminNoticeApi.deleteNotice(id);
            alert("게시글이 성공적으로 삭제되었습니다.");

            loadNotices(page).then(() => {});
        } catch (error) {
            console.log(error);
            alert("게시글 삭제 중 오류가 발생했습니다.");
        }
    };

    const handlePageChange = (page: number) => {

        searchParams.set("page", page.toString()); // searchParams 내부의 page  프로퍼티 값을 변경
        setSearchParams(searchParams); // 주소 변경
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 관리</AdminTitle>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    as={Link}
                    to={"/admin/notice/create"}>
                    + 공지사항 추가
                </Button>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"5%"}>ID</AdminTh>
                                    <AdminTh $width={"15%"}>title</AdminTh>
                                    <AdminTh $width={"40%"}>content</AdminTh>
                                    <AdminTh $width={"20%"}>생성일</AdminTh>
                                    <AdminTh $width={"10%"}>관리</AdminTh>
                                    <AdminTh $width={"10%"}>조회수</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={6}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            등록된 유저가 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{item.title}</AdminTd>
                                        <AdminTd>{item.content}</AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </AdminTd>
                                        <AdminTd>
                                            <AdminButtonGroup>
                                                <Button
                                                    variant={"icon"}
                                                    color={"primary"}
                                                    as={Link}
                                                    to={`/admin/notice/${item.id}`}>
                                                    <FiEdit size={18} />
                                                </Button>
                                                <Button
                                                    variant={"icon"}
                                                    color={"error"}
                                                    onClick={() => handleDelete(item.id)}>
                                                    <FiTrash size={18} />
                                                </Button>
                                            </AdminButtonGroup>
                                        </AdminTd>
                                        <AdminTd>0</AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}
                {total > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPage={totalPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </Card>
        </AdminContainer>
    );
}
export default AdminNoticeLis_Met;
