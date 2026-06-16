import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type WithdrawUserInputType,
    withdrawUserSchema,
} from "../../../schemas/user/widthdrawUserSchema.ts";
import { useNavigate } from "react-router";
import {
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../components/post/post.style.tsx";
import Card from "../../../components/common/card/Card.tsx";
import styled from "styled-components";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import userApi from "../../../api/user/userApi.ts";
import { useAuthStore } from "../../../stores/auth/authStore.ts";
import { isAxiosError } from "axios";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";

function MyWithdrawPage() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(withdrawUserSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: WithdrawUserInputType) => {
        try {
            await userApi.withdrawUser(data);
            alert("회원 탈퇴가 완료되었습니다. \n 그동안 서비스를 이용해주셔서 감사합니다.");
            logout();
            navigate("/");
        } catch (error) {
            let errorMessage = "회원 탈퇴 처리 중 오류가 발생했습니다.";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            alert(errorMessage);
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    회원 탈퇴 <small>안전한 계정 삭제를 위해 비밀번호를 확인합니다.</small>
                </PostTitle>
            </PostPageHeader>

            <Card>
                <WarningBox>
                    <WarningTitle>회원탈퇴 전 꼭 확인해주세요</WarningTitle>
                    <WarningList>
                        <li>탈퇴시 사용자의 모든 개인 정보와 프로필 데이터가 파기됩니다.</li>
                        <li>
                            기존 게시글 및 댓글에 대한 수정이나 삭제를 더이상 진행 할 수 없게
                            됩니다.
                        </li>
                        <li>
                            기존 게시글 및 댓글의 삭제를 원하실 경우, 탈퇴 전 직접 삭제하셔야
                            합니다.
                        </li>
                    </WarningList>
                </WarningBox>

                <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        id={"password"}
                        type={"password"}
                        placeholder={"본인 확인을 위해 현재 비밀번호를 입력하세요"}
                        label={"비밀번호 확인"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                    />

                    <AdminButtonGroup $align={"right"}>
                        <Button
                            color={"error"}
                            variant={"contained"}
                            type={"submit"}
                            disabled={isSubmitting}>
                            탈퇴하기
                        </Button>
                    </AdminButtonGroup>
                </FormWrapper>
            </Card>
        </PostContainer>
    );
}

export default MyWithdrawPage;

// 내가 백택 안에 css를 전달해주겠다는 것이지만,
// Javascript에게는 그저 string일 뿐
// 백텍 안에 ${}를 쓴다는것, javascript를 실행해서 그 내용을 string 안에 넣는 방법 =>  텝플릿 리터럴

// const error = "#ababab";
// `background-color: ${error} 이렇게 쓰면, error라고 하는 변수에 저장된 값을 저 텝플릿 리터럴 자리에 넣는다.
// 그 템플릿 리터럴 자리에 props => props.theme.colors.error
// props => {return props.theme.colors.error}
// background-color: #EF444410;   <- reba HEX, #EF4444에 투명도 10을 준값
// props.theme.color.error 하나만 가지고도 투명도를 조절해 가면서 옅은 색상을 꺼낼 수 있다.
const WarningBox = styled.div`
    background-color: ${props => props.theme.colors.error}10;
    border: 1px solid ${props => props.theme.colors.error};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 32px;
`;

const WarningTitle = styled.h4`
    font-weight: 700;
    color: ${props => props.theme.colors.error};
    margin-bottom: 12px;
`;

const WarningList = styled.ul`
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
        font-size: 14px;
        line-height: 1.5;
    }
`;
