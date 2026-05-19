import { useEffect, useState } from "react";
import adminCategoryAPi from "../../../api/admin/adminCategoryAPi.ts";
import type { Category } from "../../../types/category.type.ts";
import { Link } from "react-router";
import Button from "../../../components/common/button/Button.tsx";
import Card from "../../../components/common/card/Card.tsx";
import {
    AdminContainer,
    AdminLoadingText,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../../components/admin/admin.style.tsx";

function AdminCategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // useEffect 안에서 비동기 함수를 async-await방법으로 사용할거라면
        // 함수를 만들어서 감싸주고, 그걸 실행하동곡 문법에 맞춰서 적용
        // 그리고 그 함수 실행역시 비동기 함수에 대한 실행이기 때문에
        // then(() => {}) 아무것도 안하는 then을 붙여줌
        const loadCategories = async () => {
            try {
                const data = await adminCategoryAPi.fetchCategoryList();
                setCategories(data);
            } catch (error) {
                console.log(error);
                alert("카테고리 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        // 다음단계에 아무것도 안하겠다
        // 비동기 함수 에는 반드시 then 이것은 문법을 지키기 위해서
        loadCategories().then(() => {});
    }, []);

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>카테고리 관리</AdminTitle>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    as={Link}
                    to={"/admin/category/create"}>
                    + 카테고리 추가
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
                                    <AdminTh $width={"10%"}>ID</AdminTh>
                                    <AdminTh $width={"65%"}>카테고리명</AdminTh>
                                    <AdminTh $width={"15%"}>상태</AdminTh>
                                    <AdminTh $width={"15%"}>관리</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={4}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            등록된 카테고리가 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {categories.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{item.name}</AdminTd>
                                        <AdminTd>{item.status}</AdminTd>
                                        <AdminTd>기능</AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminCategoryListPage;

