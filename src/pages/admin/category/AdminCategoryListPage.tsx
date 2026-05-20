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
        // AdminCreateCategoryList컴포넌트를 기반으로 하는 기능
        // => 얘는 목록을 다시 불러오지 않음

        //
        // 목록의 데이터를 변경하기 위해서는 2가지 방법
        // 1. 값이 변경된 이후, 목록을 다시 백엔드에게 요청 이것은 2번 요청하게 된다.
        // 2. 백엔드에게 목록을 요청하지 하지 않고 값만 바꾸는것 여기는 setCategories만 바꾸면 된다.
        try {
            const result = await adminCategoryAPi.toggleCategoryStatus(id);
            alert(`카테고리가 성공적으로 ${result.status}로 변경되었습니다.`);

            // 변경 작업을 하게 되면, 진짜 "변경"만 끝나는 거지,
            // 우리가 화면에 출력해주는 categories의 데이터는 변하지 않음
            // 1. 전체 목록을 다시 백엔드에개 요청해서 받아와서 categories의 내용을 바꿔주던지
            //      ->  장점: 화면에 출력되는 내용이 백에드가 "진짜" 제공해준 내용으로 바꿔주므로 데이터가 진실됨
            //      ->  단점 : 목록을 다시 백엔드에게 요청해야 하므로, 백엔드가 응답이 오는데 시간이 걸림
            // 2. 백엔드에게 목록을 요청하지 않고, 화면의 데이터만 교체해줄 것임
            //     2번이 진행이 가능한 이유 : toggleCategoryStatus() 실행하면 진실된 "해당" 변경 정보는 백엔드가 주기 때문
            //     -> 장점 : 백엔드가 두번 일하지 않고서, 사용자에게 배교적 진실된 정보를 출력해줄 수 있음

            // 백엔드에게 목록을 요청하지 않고, 화면의 데이터만 교체해줄 것임
            // 내가 현재 갖고 있는 목록이 저장된 categories 중,
            // 변경 작업이 이루어진 id가 동일한 항목에 대해서만 result를 가지고 status를 바꿔주겠다
            setCategories(prev =>
               prev.map(item => (item.id === id ? { ...item, status: result.status } : item)),
            );

            // 1. categories는 state다. => 그렇기 때문에 값을 바꾸려면 setCategories를 통 할수 밖에 없다.
            // 2. 지금 하려는 건 완전히 새로운 값을 쓰려고 하는게 아니라 현재 값을 토대로 중간 내용만 살짝 바꾸고 싶다 => 그러니까  함수를 써야지
            // 2-2. 그 함수의 매개변수로 존재하는 prev는 "현재" categories에 저장된 값을 뜻하는구나
            //      setCategories(prev => {})
            // 3. 기존 값이 목록이고, 덮어쓰기 할 새로운 값도 목록이다. => return prev.map() 을 써야겠구나
            // setCategories(prev => {return prev.map()})
            // setCategories(prev => {return [{...}, {...}])
            // setCategories([{....}, {....}])
            // 3-2. .map()이가는 명령은 요소의 갯수가 같은 array가 반환

            // 4. 지금 현재 값인 Array 요소들 중, 내가 하려고 하는것 현재 요소중 id가 토글된 녀석의 값만
            // setCategories(prev => {
            // return prev.map((item) => {
            // return item.id === id ? {...item, status: result.status } : item;
            // })
            // })

            // setCategories (prev => {return prev.map(item => item.id === id ? {...item, status: result.status}: item);})
            // 이 코그을 작성할 때 기업해야 하는것
            // 백엔드가 뱉어준 "바뀐" Category의 전보는 result라는 변수가 갖고 있다
            // 그리고 "내가 변경해야 하는 그 Category의 id 정보"는 id라는 변수가 갖고 있다
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
