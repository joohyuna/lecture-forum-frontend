import { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchema.ts";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender } from "../../../types/user.type.ts";
import Button from "../../../components/common/button/Button.tsx";
import { useNavigate } from "react-router";
import axiosInstance from "../../../api/axiosInstance.ts";
import * as axios from "axios";

function SignUpPage() {
    const navigate = useNavigate();
    // 회원가입 화면

    // input들을 react-hook-form으로 관리
    // 사용자가 입력한 값들을 백엔드로 보내기 전, 검증 절차 중요  => zod
    // 화면 작성

    // react-hook-form만 이용한다면, 사용자가 입력하는 값에 대한 검증 내용을
    // input {...register(input이름, {옵션})}
    // 형태로 옵션자리에 기재해줌
    //
    // 근데 react-hook-form + zod를 이용한다면 이미 검증 내용이 zod에 있음
    // 그렇다면, react-hook-form에 다가 zod의 검증 내용을 알려주면 되지 않을까?

    // 이렇게 zod의 내용을 react-hook-form에 연결하기 위한 라이브러리 설치
    // pnpm install @hookform/resolvers

    // isSubmitting : handleSubmit을 통해 "전송" 중이라면 true, 아니라면 false 값
    // setError : 에러 발생시, 해당 항목에 대한 에러메세지를 설정하는 메서드
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur", // mode 언제 검증할 것인지 // input을 떠나면 검증할것인지, 타이밍
        // 검색하고 빠져 나갈때 가 onBlur
    });

    // errors
    // 처음에는 errors = {} 형태롤 존재함
    // 그러다가 각 항목에 에러가 발생이 되면 (검증이 실패하면) 그안에 key가 추가됨
    // username의 검증에 실패하면 errors = {username: {message: "에러내용"}}; 형태가 됨
    // errors는 각 항목에 대한 에러만 관리하는게 아니라 대표 errors항목인 "root"라는 항목도 있음

    // 어디에다가도
    const onSubmit = async (data: SignUpInputType) => {
        try {
            // 전송에 대한 내용을 기재하면 되는데, 그대로 데이터를 전달할 것인가?
            // 프론튼엔드에서 '만' 필요한 passwordConfirm 항목이 추가되었음, 예 빼고 전송
            // passwordConfirm 문법 오류 라는 뜻 실행에는 문제가 되지 않는다 ESLint 문법검사기가 잡은 에러
            const { passwordConfirm, ...submitDate } = data;

            // 200번때 일때만 성공 진짜 성공에 대한 내용만 남는다.
            // fetch()로 통신을 하면, 백엔드에 전달해주는 response가 존재하기만 하면 성공으로 판단하지만
            // axios로 통신을 하면, 백엔드가 2xx벉대 성공 코드를 전달해줘야만 성공으로 판단
            // 이외의 에러는 catch로 처리됨
            await axiosInstance.post("/user/create", submitDate);

            // 성공을 했었을 때 백엔드가 전달해준 내용은 response.date에 객체 상태로 존재함 (JSON 파싱할 필요 없음)

            // 백엔드에게 전송해서 성공
            alert("회원가입이 완료되었습니다. 로그인을 진행해주세요");
            navigate("/auth/signin");
        } catch (error) {
            // 기본 에러 메세지를 미리 넣어서 errorMessage 마련
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            // 지금 catch된 error가 axios의 에러인지 판별
            if (axios.isAxiosError(error)) {
                // axios에서 발생된 에러라면, 백엔드엥 제공을 한 내용이 error.response.data.messaged애 존재
                //  그백엔등에 전달해준 내용을 errorMessage에 저장
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                // axios에서 발생한 에러가 아닌, 자바스크립트에 표준에러 객체관리
                // error.message에 담긴 에러 내용을 errorMessage에 저장
                errorMessage = error.message;
            }

            setError("root", {message: errorMessage});
        }
    };

    return (
        <AuthContainer>
            <FormCard onSubmit={handleSubmit(onSubmit)}>
                <Title>회원가입</Title>
                <SubTitle>토론대난투에 오신것을 환영합니다.</SubTitle>
                <FormBox>
                    <InputGroup>
                        <Label htmlFor={"username"}>아이디</Label>
                        <Input
                            {...register("username")}
                            $hasError={!!errors.username} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"username"}
                            placeholder={"4자이상 필요"}
                        />
                        {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"password"}>비밀번호</Label>
                        <Input
                            {...register("password")}
                            $hasError={!!errors.password} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"password"}
                            placeholder={"6자이상 필요"}
                            type={"password"}
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"password"}>비밀번호 확인</Label>
                        <Input
                            {...register("passwordConfirm")}
                            $hasError={!!errors.passwordConfirm} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"passwordConfirm"}
                            placeholder={"비밀번호를 한 번 더 입력해주세요"}
                            type={"password"}
                        />
                        {errors.passwordConfirm && (
                            <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"name"}>이름</Label>
                        <Input
                            {...register("name")}
                            $hasError={!!errors.name} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"name"}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"nickname"}>닉네임</Label>
                        <Input
                            {...register("nickname")}
                            $hasError={!!errors.nickname} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"nickname"}
                            placeholder={"닉네임은 2자 이상 입력해주세요 "}
                        />
                        {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"email"}>이메일</Label>
                        <Input
                            {...register("email")}
                            $hasError={!!errors.email} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"email"}
                            type={"email"}
                        />
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"phoneNumber"}>전화번호</Label>
                        <Input
                            {...register("phoneNumber")}
                            $hasError={!!errors.phoneNumber} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"phoneNumber"}
                            type={"tel"}
                        />
                        {errors.phoneNumber && (
                            <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"birthdate"}>생년월일</Label>
                        {/* type="date"를 통해 입력을 받더라도, 전송하는 내용은 "xxxx-xx-xx" 형태의 string이 전송됨 */}
                        <Input
                            {...register("birthdate")}
                            $hasError={!!errors.birthdate} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"birthdate"}
                            type={"date"}
                        />
                        {errors.birthdate && (
                            <ErrorMessage>{errors.birthdate.message}</ErrorMessage>
                        )}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"gender"}>성별</Label>
                        <Select
                            {...register("gender")}
                            $hasError={!!errors.gender} // !를 붙인다는건, 어떤한 값이든 있으면 false 없으면 true, 반대로 boolean으로 형변환된다.
                            // !!를 붙인다면, 어떠한 값이든 있으면 true 없으면 false, boolean으로 형변환
                            id={"gender"}>
                            <option value={""}>성별을 선택해주세요</option>
                            <option value={Gender.MALE}>남성</option>
                            <option value={Gender.FEMALE}>여성</option>
                        </Select>
                        {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
                    </InputGroup>
                </FormBox>

                {errors.root && <RootErrorMessage>{errors.root.message}</RootErrorMessage>}

                <Button
                    color={"primary"}
                    variant={"contained"}
                    fullWidth={true}
                    disabled={isSubmitting}
                    type={"submit"}>
                    회원가입
                </Button>
            </FormCard>
        </AuthContainer>
    );
}

export default SignUpPage;

const AuthContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormCard = styled.form`
    width: 100%;
    max-width: 480px;
    padding: 40px 20px;
    background-color: ${props => props.theme.colors.background.paper};
    border-radius: 16px;
    border: 1px solid ${props => props.theme.colors.divider};
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 800;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 8px;
    text-align: center;
`;

const SubTitle = styled.h6`
    font-size: 15px;
    color: ${props => props.theme.colors.text.disabled};
    text-align: center;
    margin-bottom: 32px;
`;

const FormBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 50px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 800;
    color: ${props => props.theme.colors.text.default};
`;

const Input = styled.input<{ $hasError?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    border: 1px solid
        ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${props => props.theme.colors.text.default};
    transition: all 0.5s;
    &::placeholder {
        color: ${props => props.theme.colors.text.disabled};
    }
    &:focus {
        border-color: ${props =>
            props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    }
`;

const ErrorMessage = styled.span`
    font-size: 15px;
    color: ${props => props.theme.colors.error};
    font-weight: 500;
`;

const Select = styled.select<{ $hasError?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    border: 1px solid
        ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${props => props.theme.colors.text.default};
    transition: all 0.5s;
    &::placeholder {
        color: ${props => props.theme.colors.text.disabled};
    }
    &:focus {
        border-color: ${props =>
            props.$hasError ? props.theme.colors.error : props.theme.colors.primary};
    }
`;

const RootErrorMessage = styled.p`
    font-size: 14px;
    text-align: center;
    color: ${props => props.theme.colors.error};
    font-weight: 500;
    margin-bottom: 50px;
`;
