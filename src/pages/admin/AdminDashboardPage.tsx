import { Role, type User } from "../../types/user.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import { useEffect, useState } from "react";
import adminDashboardApi from "../../api/admin/adminDashboardApi.ts";
import {
    AdminContainer,
    AdminDashboardTitle,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../components/admin/admin.style.tsx";
import Card from "../../components/common/card/Card.tsx";
import Badge from "../../components/common/badge/Badge.tsx";
import {Link} from "react-router";
import { FiFile, FiMessageSquare, FiUser } from "react-icons/fi";


function AdminDashboardPage() {
    // 백엔드에게 요청해서 데이터를 받아올 것이니
    // 그에 따른 state 선언
    const [dashboard, setDashboard] = useState<{
        users: User[],
        posts: Post[],
        inquiries: Inquiry[],
    } | null>(null);
    //const [isLoading, setIsLoading] = useState(true);

    // useEffect + axios API를 통해 데이터를 받아오고
    useEffect(() => {
        const loadRecent = async () => {
            try {
                const result = await adminDashboardApi.adminRecentList();
                setDashboard(result);
            } catch (error) {
                console.error(error);
            }
        }
        loadRecent().then(() => {});

    }, []);

    if (!dashboard) {
        return (
            <AdminContainer>
                <div style={{ padding: "100px", textAlign: "center", fontSize: "18px" }}>
                    데이터를 불러오는 중입니다...
                </div>
            </AdminContainer>
        );
    }

    // 그에 대한 화면을 출력하고
    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>DASHBOARD</AdminTitle>
            </AdminPageHeader>

            <Card>
                <AdminDashboardTitle>
                    <FiUser size={20} />
                    <h3>유저관리</h3>
                </AdminDashboardTitle>
                <AdminTableWrapper>
                    <AdminTable>
                        <thead>
                            <tr>
                                <AdminTh $width={"5%"}>ID</AdminTh>
                                <AdminTh $width={"15%"}>아이디</AdminTh>
                                <AdminTh $width={"15%"}>이름 (닉네임)</AdminTh>
                                <AdminTh $width={"20%"}>이메일</AdminTh>
                                <AdminTh $width={"10%"}>권한</AdminTh>
                                <AdminTh $width={"10%"}>상태</AdminTh>
                                <AdminTh $width={"15%"}>가입일</AdminTh>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.users.length === 0 && (
                                <tr>
                                    <AdminTd
                                        colSpan={7}
                                        style={{ textAlign: "center", padding: "100px" }}>
                                        등록된 유저가 없습니다.
                                    </AdminTd>
                                </tr>
                            )}
                            {dashboard.users.map(item => (
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
                                            color={item.role === Role.ADMIN ? "error" : "primary"}>
                                            {item.role === Role.ADMIN ? "관리자" : "일반"}
                                        </Badge>
                                    </AdminTd>
                                    <AdminTd>
                                        <Badge color={item.deletedAt ? "default" : "success"}>
                                            {item.deletedAt ? "탈퇴" : "정상"}
                                        </Badge>
                                    </AdminTd>
                                    <AdminTd>{new Date(item.createdAt).toLocaleString()}</AdminTd>
                                </tr>
                            ))}
                        </tbody>
                    </AdminTable>
                </AdminTableWrapper>
            </Card>
            <Card>
                <AdminDashboardTitle>
                    <FiFile size={20} />
                    <h3>게시판관리</h3>
                </AdminDashboardTitle>
                <AdminTableWrapper>
                    <AdminTable>
                        <thead>
                            <tr>
                                <AdminTh $width={"10%"}>번호</AdminTh>
                                <AdminTh>제목</AdminTh>
                                <AdminTh $width={"15%"}>작성자</AdminTh>
                                <AdminTh $width={"15%"}>작성일</AdminTh>
                                <AdminTh $width={"10%"}>조회수</AdminTh>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.posts.length === 0 && (
                                <tr>
                                    <AdminTd
                                        colSpan={5}
                                        style={{ textAlign: "center", padding: "100px" }}>
                                        아직 작성된 게시글이 없습니다. 첫 글을 남겨보세요
                                    </AdminTd>
                                </tr>
                            )}
                            {dashboard.posts.map(item => (
                                <tr key={item.id}>
                                    <AdminTd>{item.id}</AdminTd>
                                    <AdminTd className={"title-cell"}>
                                        <Link to={`/post/${item.id}`}>{item.title}</Link>
                                    </AdminTd>
                                    <AdminTd>{item.user.nickname}</AdminTd>
                                    <AdminTd>
                                        {new Date(item.createdAt).toLocaleString("ko-KR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </AdminTd>
                                    <AdminTd>{item.views}</AdminTd>
                                </tr>
                            ))}
                        </tbody>
                    </AdminTable>
                </AdminTableWrapper>
            </Card>
            <Card>
                <AdminDashboardTitle>
                    <FiMessageSquare size={20} />
                    <h3>1:1 문의 관리</h3>
                </AdminDashboardTitle>
                <AdminTableWrapper>
                    <AdminTable>
                        <thead>
                            <tr>
                                <AdminTh $width={"10%"}>ID</AdminTh>
                                <AdminTh $width={"60%"}>제목</AdminTh>
                                <AdminTh $width={"20%"}>작성일</AdminTh>
                                <AdminTh $width={"10%"}>작성자</AdminTh>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.inquiries.length === 0 && (
                                <tr>
                                    <AdminTd
                                        colSpan={4}
                                        style={{ textAlign: "center", padding: "100px 0" }}>
                                        등록된 문의가 없습니다.
                                    </AdminTd>
                                </tr>
                            )}
                            {dashboard.inquiries.map(item => (
                                <tr key={item.id}>
                                    <AdminTd>{item.id}</AdminTd>
                                    <AdminTd>
                                        <Link to={`/admin/inquiry/${item.id}`}>{item.title}</Link>
                                    </AdminTd>
                                    <AdminTd>{new Date(item.createdAt).toLocaleString()}</AdminTd>
                                    <AdminTd>{item.user.nickname}</AdminTd>
                                </tr>
                            ))}
                        </tbody>
                    </AdminTable>
                </AdminTableWrapper>
            </Card>
        </AdminContainer>
    );
}

export default AdminDashboardPage;