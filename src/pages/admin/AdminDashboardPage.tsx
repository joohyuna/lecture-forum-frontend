import { Role, type User } from "../../types/user.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import { useEffect, useState } from "react";
import adminDashboardApi from "../../api/admin/adminDashboardApi.ts";
import {
    AdminContainer,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../components/admin/admin.style.tsx";
import Card from "../../components/common/card/Card.tsx";
import Badge from "../../components/common/badge/Badge.tsx";


function AdminDashboardPage() {
    // 백엔드에게 요청해서 데이터를 받아올 것이니
    // 그에 따른 state 선언

    // useEffect + axios API를 통해 데이터를 받아오고
    useEffect(() => {
        const loadRecent = async () => {
            try {
                const result = await adminDashboardApi.adminRecentList();
                setDashboardList(result);
            } catch (error) {
                console.error(error);
            }
        }
        loadRecent().then(() => {});

    }, []);



    // 그에 대한 화면을 출력하고
    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>사용자 관리</AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminTableWrapper>
                    <AdminTable>
                        <thead>
                            <tr>
                                <AdminTh $width={"5%"}>ID</AdminTh>
                                <AdminTh $width={"15%"}>아이디</AdminTh>
                                <AdminTh $width={"15%"}>이름 (닉네임)</AdminTh>
                                <AdminTh $width={"25%"}>이메일</AdminTh>
                                <AdminTh $width={"10%"}>권한</AdminTh>
                                <AdminTh $width={"10%"}>상태</AdminTh>
                                <AdminTh $width={"20%"}>가입일</AdminTh>
                            </tr>
                        </thead>
                        <tbody>
                        {dashboardList.length === 0 && (
                            <tr>
                                <AdminTd colSpan={7} style={{textAlign: "center", padding: "60px"}}></AdminTd>
                            </tr>
                        )}
                        {dashboardList.map(item => (
                            <tr key={item.id}>
                                <AdminTd>{item.id}</AdminTd>
                                <AdminTd>{item.username}</AdminTd>
                                <AdminTd>{item.nickname}</AdminTd>
                                <AdminTd>{item.email}</AdminTd>
                                <AdminTd>
                                    <Badge color={item.role === Role.ADMIN ? "error" : "primary"}>
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
        </AdminContainer>
    );
}

export default AdminDashboardPage;