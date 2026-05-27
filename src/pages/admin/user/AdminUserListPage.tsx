import { useEffect, useState } from "react";
import { Role, type User } from "../../../types/user.type.ts";
import adminUserApi from "../../../api/admin/user/adminUserApi.ts";
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
import { Link, useSearchParams } from "react-router";
import Card from "../../../components/common/card/Card.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";
import { FiEdit, FiTrash } from "react-icons/fi";

function AdminUserListPage() {
    const [list, setList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    // const pageParams = searchParams.get("page");
    // const page = page
    const page = Number(searchParams.get("page")) || 1;

    const SIZE = 20; // 고정값
    // const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / SIZE); // Math.ceil() : 올림 메서드

    const loadUsers = async (page: number) => {
        try {
            const data = await adminUserApi.fetchUserList(page, SIZE);
            setList(data.list);
            setTotal(data.total);
        } catch (error) {
            console.log(error);
            alert("사용자 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect는 초기 렌더링이 끝난 즉시 1번 무조건 실행
    // 이 화면에서는 page가 바뀔때 목록 갱신 함수가 실행되어야 함 => useEffect의 의존성이 하는 일
    // useEffect는 useEffect(함수, 의존성 배열);
    // useEffect(() => {}, [요기가 의존성 배열]);
    // 의존성 배열에 넣은 변수나 함수나 메서드나 state가 바뀔때 재 실행됨
    // 의존성이 없을 때 [] => 초기 렌더링이 끝난 이후 무조건 1번 실행
    // 이 함수를 page state의 값이 바뀔 때 실행을 해줄 필요가 생김
    // 의존성 배열이 있는 이유는,
    // 의존성 배열이 state나 함수나, 변수를 집어넣을 수 있는데
    //

    useEffect(() => {
        // 이 함수는, 백엔드에게 내용을 받아서 state에 저장 => 화면 출력을 해주는 함수를 useEffect 매개 변수 안에 작성해서
        // 함수 안에 함수를 선언하고, 그걸 실행 했었음
        // 함수 스코프에 의해 외부에서는 실행이 불가능함 => 외부에서 저 기능을 이용해야 되는 상황이 되었으니
        // 그함수를 밖으로 뺌

        // 사용자의 스크롤을 이동시키는 명령
        // window 브라우저에서 사용자의 위치to
        window.scrollTo({ top: 0, behavior: "instant" });

        // 문법 오류
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers(page).then(() => {});
    }, [page]);

    const handleDelete = async (id: number) => {
        // confirm은 사용자에게 경고차을 통해 확인을 받는 메서드, true/false가 반환됨
        // 그렇게 최소를 하면 더이상 함수 진행을 안함
        if (!confirm("정말 이 유저를 삭제(탈퇴) 처리 하시겠습니까?")) {
            return;
        }

        try {
            await adminUserApi.deleteUser(id);
            alert("사용자 정보가 성공적으로 삭제되었습니다.");

            // 그렇게 삭제처리가 끝난 정보가 result에 도착했고,
            // 사용자 화면에 반영해줘야 함
            // 1. 다시금 백엔드에게 요청해서 데이터를 받아 화면 갱신
            // 2. 삭제됨 사용자 정보를 화면에 바로 반영 (백엔드 X)
            // 카테고리 목록 화면에서는 2번으로 진행 했었음

            // 1번으로 진행을 하려면 => 이미 우리가 작성한 내용이 있음
            // 1-1 백엔드에게 다시 데이터 요청
            // 1-2. 받아온 정보를 목록을 관리하는 status에 덮어쓰기
            loadUsers(page).then(() => {});
        } catch (error) {
            console.log(error);
            alert("사용자 삭제 중 오류가 발생했습니다.");
        }
    };

    const handlePageChange = (page: number) => {
        // status의 값을 바로 바꾸는게 아니라,
        // 쿼리스트링에 존재하는 page의 값을 변경해야 함
        searchParams.set("page", page.toLocaleString()); // searchParams 내붕의 page  프로퍼티 값을 변경
        setSearchParams(searchParams); // 주소 변경
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>사용자 관리</AdminTitle>
                <Button color={"primary"} variant={"contained"} as={Link} to={"/admin/user/create"}>
                    + 사용자 추가
                </Button>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <AdminTh $width={"5%"}>ID</AdminTh>
                                <AdminTh $width={"15%"}>아이디</AdminTh>
                                <AdminTh $width={"15%"}>이름 (닉네임)</AdminTh>
                                <AdminTh $width={"20%"}>이메일</AdminTh>
                                <AdminTh $width={"10%"}>권한</AdminTh>
                                <AdminTh $width={"10%"}>상태</AdminTh>
                                <AdminTh $width={"15%"}>가입일</AdminTh>
                                <AdminTh $width={"10%"}>관리</AdminTh>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={8}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            등록된 유저가 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{item.username}</AdminTd>
                                        <AdminTd>
                                            {item.name} <br />
                                            <small>{item.nickname}</small>
                                        </AdminTd>
                                        <AdminTd>{item.email}</AdminTd>
                                        <AdminTd>
                                            <Badge
                                                color={
                                                    item.role === Role.ADMIN ? "error" : "primary"
                                                }>
                                                {item.role === Role.ADMIN ? "관리자" : "일반"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            <Badge color={item.deletedAt ? "default" : "success"}>
                                                {item.deletedAt ? "탈퇴" : "정상"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </AdminTd>
                                        <AdminTd>
                                            <AdminButtonGroup>
                                                <Button
                                                    variant={"icon"}
                                                    color={"primary"}
                                                    as={Link}
                                                    to={`/admin/user/${item.id}`}>
                                                    <FiEdit size={18} />
                                                </Button>
                                                {!item.deletedAt && (
                                                    <Button
                                                        variant={"icon"}
                                                        color={"error"}
                                                        onClick={() => handleDelete(item.id)}>
                                                        <FiTrash size={18} />
                                                    </Button>
                                                )}
                                            </AdminButtonGroup>
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}
                {total > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "20px",
                        }}>
                        <Button
                            variant={"text"}
                            color={"primary"}
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}>
                            이전
                        </Button>
                        <Button
                            variant={"text"}
                            color={"primary"}
                            disabled={page === totalPage}
                            onClick={() => handlePageChange(page + 1)}>
                            다음
                        </Button>
                    </div>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminUserListPage;
