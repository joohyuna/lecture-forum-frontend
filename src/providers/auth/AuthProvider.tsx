// PropsWithChildren  타입은 React 기본 제공 타입
// 자식 컴포넌트를 갖는 형태를 너무 많이 쓰기 때문에 기본으로 제공중
// type Props = {
//     width: string,
//     children: ReactNode;
// };
//
// 해당 타입을 확장해서 사용하는 방법은 interface일 경우 extends
// interface Props extends PropsWithChildren {
//   width: string;
// }
//
// type일 겨우 & 연산자 사용
// type Props = PropsWithChildren & {width: string};

import { type PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import userApi from "../../api/user/userApi.ts";

type Props = PropsWithChildren;

function AuthProvider({ children }: Props) {
    const { isLoggedIn, token, logout } = useAuthStore();
    // 초기화
    const [isInitialized, setIsInitialized] = useState(true);

    useEffect(() => {
        const checkAuthValidity = async () => {
            if (isLoggedIn && token) {
                try {
                    // 백엔드에게 내가 갖고 있는 토큰이 정상 토큰인지 확인 요청을 해야함
                    const result = await userApi.getMe();

                    // 회사에서 사용하다가, 집에가서 사용자 정보 업데이는 를 했을 수도 있잔하
                    useAuthStore.setState({ user: result });
                } catch (error) {
                    console.log(error);
                    // catch절이 실행되었다는 이야기는, 백엔드에서 검증에 실패했다는 이야기
                    // 모든 정보를 날려야 한다.
                    logout();
                    // 로그인이 안된 사용자라면, 로그아웃을 할거라면, 메인화면으로 보내댜 되지 않나?
                    // 로그인이 풀렸으면, 풀렸다는걸 알려주고 로그인 페이지로 보내야되겠다
                    // 안해줘도 된다. 만들어 줄 필요가 없다 Router가 끊을 것이다.
                    // alert("로그인 세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요");
                    // navigate("/auth/login")

                    // 만양 그러한 덧붙이는 생각을 안한다면
                    // 어차피 화원 전용 페이지는 GetRouter가 loader의해 끊을 것이므로
                    // 덧붙이는 내용이 없어도 무방함
                }
            }
            // 화면이 하얀 상태에서
            //
            setIsInitialized(false);
        };
        checkAuthValidity().then(() => {});
    }, [isLoggedIn, logout,token]);

    if (isInitialized) {
        return null; // 아무것도 돌려줄것이 없다.
    }

    return <>{children}</>;
}

export default AuthProvider;
