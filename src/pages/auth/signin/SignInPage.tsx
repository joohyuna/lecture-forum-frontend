import { type SignInInputType, signInSchema } from "../../../schemas/auth/signInSchema.ts";
import { useForm } from "react-hook-form";
import Button from "../../../components/common/button/Button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../../../api/axiosInstance.ts";
import { useNavigate } from "react-router";
import * as axios from "axios";
import {
    AuthContainer,
    AuthFormBox,
    AuthFormCard,
    AuthRootErrorMessage,
    AuthSubTitle,
    AuthTitle,
} from "../../../components/auth/auth.style.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";




function SignInPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInInputType>({
        resolver: zodResolver(signInSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignInInputType) => {
        try {
            //  SignUp에서는 백엔드가 뭐라고 대답하든 "성공"이면 신경 안써도 됐는데
            // SignIn에서는 백엔드가 "성공" 대답하면서 신분증 (token)을 응답함
            const response = await axiosInstance.post("/user/login", data);
            // axios의 응답값인 response는 response.data에 실제 백엔드가 응답하는 데이터가 담김
            // user 정보와 token을 불러와야함
            // data가 2개인 내용은 response.data 리스폰스
            const { user, token } = response.data.data;
            // 신분븡 발급은 login이라는 행위를 할때에만 발급이됨
            // 그렇기 때문에 이 token을 어딘가(ContextAPI등 , localStorage)에 저장해서
            // 사용자가 백엔드에 요청을 할 때 마다 꺼내서 집어넣고 요청을 해야함
            localStorage.setItem("accessToken", token);

            alert("로그인에 성공했습니다!");
            navigate("/");
        } catch (error) {
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (axios.isAxiosError(error)) {
                // catch에 모여지는 error는
                // axios에서 발생한 에러 일 수도 있고, 아닐 수도 잇는데 (통신 자체 실패)
                // axios에서 발생한 에러이더라도
                // 백엔드가 정산적으로 뱉어준 2xx 아닌 에러들은 백엔드아 {message: "어쩌구"} 형태로 응답함
                // 그렇기 때문데 {message: "어쩌구"}가 있을때에은 그내용을 errorMessage에 저장
                // 아니라면 기본 메세지인 "로그인 중 오류가 발생했습니다."를 유지 하겠다
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <AuthContainer>
            <AuthFormCard onSubmit={handleSubmit(onSubmit)}>
                <AuthTitle>로그인</AuthTitle>
                <AuthSubTitle>다시 오신것을 환경합니다.</AuthSubTitle>

                <AuthFormBox>
                    <InputGroup
                        label={"아이디"}
                        id={"username"}
                        registerObj={register("username")}
                        errorMessage={errors.username?.message}
                        placeholder={"4자이상 필요"}
                    />

                    <InputGroup
                        label={"비밀번호"}
                        id={"password"}
                        registerObj={register("password")}
                        errorMessage={errors.password?.message}
                        placeholder={"6자이상 필요"}
                        type={"password"}
                    />
                </AuthFormBox>
                {errors.root && <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>}
                <Button
                    color={"primary"}
                    variant={"contained"}
                    fullWidth={true}
                    disabled={isSubmitting}
                    type={"submit"}>
                    로그인
                </Button>
            </AuthFormCard>
        </AuthContainer>
    );
}

export default SignInPage;


