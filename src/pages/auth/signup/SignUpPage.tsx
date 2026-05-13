import  { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function SignUpPage() {
    // 회원가입 화면

    // input들을 react-hook-form으로 관리
    // 사용자가 입력한 값들을 백엔드로 보내기 전, 검증 절차 중요  => zod
    // 화면 작성

    // react-hook-form만 이용한다면, 사용자가 입력하는 값에 대한 검증 내용을
    // input {...register(input이름, {옵션})}
    // 형태로 옵션자리에 기재해줌
    //
    // 근데 react-hook-form + zod를 이용한다면 이미 검증 쟁요이 zod에 있음
    // 그렇다면, react-hook-form에 다가 zod의 검증 내용을 알려주면 되지 않을까?

    // 이렇게 zod의 내용을 react-hook-form에 연결하기 위한 라이브러리 설치
    // pnpm install @hookform/resolvers
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur"  // 언제 검증할 것인지 // input을 떠나면 검증할것읹지, 타이밍
        // 검색하고 빠져 나갈때 가 onBlur
    });


    return <></>;
}

export default SignUpPage;
