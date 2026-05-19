import { useEffect, useState } from "react";
import adminCategoryAPi from "../../../api/admin/adminCategoryAPi.ts";
import { type Category, CategoryStatus } from "../../../types/category.type.ts";
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
import Badge from "../../../components/common/badge/Badge.tsx";
import { FiRefreshCcw, FiTrash2 } from "react-icons/fi";

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

    const handleToggleCategoryStatus = async (id: number) => {
        // 백엔드에게 그 카테고리의 status를 바꿔줘 -> 함수를 실행 할 때 id를 받아와야 함
        // 생성은 아예 다른 컴포넌트에서 일어나는 일이기 때문에,
        // 생성이 끝난 후, /admin/category 주소로 사용자를 이동
        // -> 다시금 AdminCreateCategoryList 컴포넌트가 화면에 그려졌기 때문에
        // 거기에 포함되어 있는 fetchCategoryList가 동작되었을 뿐

        // 지금 우리가 만든 toggleCategory라는 기능은
        // AdminCreateCategoryList컼포넌트를 기반으로 하는 기능
        // => 얘는 목록을 다시 불러오지 않음

        // 목록의 데이터를 변경하기 위해서는 2가지 방법
        // 1. 값이 변경된 이후, 목록을 다시
        // 2. 백엔드에게 목록을 요청하지
        try {
            const result = await adminCategoryAPi.toggleCategoryStatus(id);
            alert(`카테고리가 성공적으로 ${result.status}로 변경되었습니다.`);

            // 백엔드에게 목록을 요청하지 않고, 화면의 데이터만 교체해줄 것임
            setCategories(prev => prev.map(item => (item.id === id ? {...item, status: result.status} : item)),
            );

        } catch (error) {
            console.log(error);
            alert("카테고리에서 에러가 났습니다.");

        }
    };

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
                                        <AdminTd>
                                            <Badge
                                                color={
                                                    item.status === CategoryStatus.ACTIVE
                                                        ? "success"
                                                        : "secondary"
                                                }>
                                                {item.status === CategoryStatus.ACTIVE
                                                    ? "활성"
                                                    : "비활성"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            <Button
                                                color={"primary"}
                                                variant={"icon"}
                                                onClick={() => handleToggleCategoryStatus(item.id)}>
                                                {item.status === CategoryStatus.ACTIVE ? (
                                                    <FiTrash2 size={18} />
                                                ) : (
                                                    <FiRefreshCcw size={18} />
                                                )}
                                            </Button>
                                        </AdminTd>
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
