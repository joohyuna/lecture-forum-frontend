import * as axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL, // 통신을 진행할 상대의 기본 주소 이것만 필수
    timeout: 5000, // 통신 요청을 했을 때 실패되었다고 판단하는 타임 아웃 시간 (ms 밀리세컨드 단위, 5초)
    withCredentials: true,  // CORS 요청을 허용할지 여부
});

export default api;
