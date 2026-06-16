import * as axios from "axios";
import { useAuthStore } from "../stores/auth/authStore.ts";
import { isAxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL, // 통신을 진행할 상대의 기본 주소 이것만 필수
    timeout: 5000, // 통신 요청을 했을 때 실패되었다고 판단하는 타임 아웃 시간 (ms 밀리세컨드 단위, 5초)
    withCredentials: true, // CORS 요청을 허용할지 여부
});

export default api;

// 인터셉터 : 요청을 보내기 전에 axios가 내용을 가로채서 내용을 변경 할 수 있음

// 리퀘스트에 해당하는 인터셉터는 api.interceptors.request에 등록할수 있고,
// api.interceptors.request.use() 메서드에 해당 내용을 매개변수에 함수로서 작성
// 내가 무슨직전을 할지 직전에 함수
// 그렇게 집어 넣는 함수의 매개변수 첫 자리에는 Request를 보낼 때의 설정 정보가 들어옴
// config에 모든 정보가 들어있음
api.interceptors.request.use(config => {
    // 우리가 프론트엔드에서 갖고 있는 토큰정보를 가지고서
    // Request의 HTTP 메세지 헤더에 넣어줘야 함
    // 신분증(token)을 발급하는 주체: 백엔드
    // 신분증(token) 발급 타이이밍: 로그인 할 때
    // token 정보는 login 요청을 보내면 발급되고, 그걸 Zustand의 AuthStore에 저장 했음

    const { token } = useAuthStore.getState();

    // 이 interceptor는 이 axiosInstance를 사용하는 모든 요청에 발동되는 기능이고,
    // 사용하는 로그인 되어져 있을 수도 잇고, 없을수도 있으므로
    // token이 있을수도 있고 없을수도 잇음
    // 그러니, token이 있을 때만 헤더에 추가해 줘야 하는구나

    if (token) {
        // token이 있을 때만 요청 해더에 토튼 정보를 기재해서 보냄
        // config.headers <- axios를 사용할 때 HTTP 메세지 헤더는 이렇게 접근 가능

        // 토큰 정보는 꼭 Authorization 이라른 key에 값으로 입력해줘야 하며,
        // 심지어 값에 token만 넣는것이 아니라 꼭  Bearer 라는 글자를 앞에 붙여서 넣어줘야함
        config.headers.Authorization = `Bearer ${token}`; // 약속 // 내가 코드를 써줬으니깐

        // 토큰 앞에 붙이는 prefix(접두사)를 붙이는 이유
        // Bearer라고 붙이면, 그 뒤에는 JWY token 처럼 string으로 암호화 한 값이 들어간다는 의미
        // Basic라고 붙으면, 그 뒤에는 Base64로 인코딩된 값이 들어간다는 의미
        // Digest라고 붙으면, MDS 형식으로 암호화한 것이 들어간다는 의미
    }
    return config;
});

// api.interceptors.response에는 그렇게 요청한 응답이 도착했을 때
// 응답을 실제 사용라기 전, 해야할 일에 대해서  api.interceptors.response.use() 응답을 받은 직후
// 등록 할 수 있음
// interceptors.response.use(성공(HTTP STATUS 200)일때 해야되는일(함수), 실패(HTTP STATUS 4XX)일 때 해야되는일(함수));
api.interceptors.response.use(
    response => response,
    error => {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                // 401 로그인등 이 잘못되었다
                // 403 권한이 없을때
                // 얘는 컴포너트 밖에서 일어난다. 얘는 미들웨어같이 사용한다.
                useAuthStore.getState().logout();
                // 사용자를 이동시켜줘야 하는데, 마찬가지로 컴포넌트 안이 아니니까 useNavigate를 쓸수 없음
                // useState(x), useEffect(X), useNavigate(X), react-hook 전부 다 못 씀
                alert("로그인 세션이 만로되었습니다. 다시 로그인해주세요");
                window.location.href = "/auth/login";
            }
        }

        // 인터셉터를 통해 "실패"에 해당하는 HTTP status code가 와서 axios는 실패(두번째 매개변수)로 잡았지만
        // return에 따라 상위try - catch에서 잡는걸 바꿔줄 수도 있음
        // 성공으로 바꿔주려면 Promise.resolve()
        // 실패로 진행하려면 Promise.reject()
        return Promise.reject(error); // 원래 이게 실행되고 있었던 try - catch 절에 catch로 다시 던짐
    },
);
