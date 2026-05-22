
import Input from "./Input.tsx";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import { ErrorMessage, Label, StyledInputGroup } from "../group/Group.tsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    id?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn;
    wrap?: boolean;
}


// 원래 input을 수동 관리를 하게된다면, <input onChange={() => {}}  value={} name="username" /> 형태
// react-hook-form을 이용할 경우, <input {...register("username")} />로 사용 했는데
// 이것은
// register("username")를 실행한 결과 (리턴)에
// {
//  onChange: () => {},
// value: "",
// name: "username",
// }
// 이러한 객체였기 때문에 그것을 스프레드 문법을 통해 input태그 안에 흩뿌려준것
// 그럻게 때문에 InputGroup이라는 컴포넌트는 registerObj라는 이을믈 register()를 실행한 결과 값을
// 받아서 Input내붕어 뿌려줌
// rester()싫행한 결과 객체의 타입을 UseFormRegisterReturn
// ...props 선언
// 하단은 ... 값 props
function InputGroup({label, id, errorMessage, registerObj, wrap, ...props}: Props) {
    return (
        <StyledInputGroup $wrap={wrap}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input id={id} $hasError={!!errorMessage} {...registerObj} {...props} />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </StyledInputGroup>
    );
}

export default InputGroup;