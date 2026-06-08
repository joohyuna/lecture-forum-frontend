import axiosInstance from "../axiosInstance.ts";
import type { Notice } from "../../types/notice.type.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";

const getNoticeById = async (noticeId: number): Promise<Notice> => {
    const response = await axiosInstance.get(`/notice/${noticeId}`);
    return response.data.data;
}

// axios는 리턴되는 겂에 바로 response 내용이 들어가지 않음
// const response = {
// 우리가 요청한 내용,
// 네트워크 진행 사항,
// data {
// message: "",
// data {
// page, size, total, list,
// }
// }
// }
// 이 중에 return 해 준 것만 내용을 적어주는 것이 Promise 지정해서 나갈거야 사용하는 쪽에서
const getNoticeList = async (page?: number, size?: number): Promise<PaginationResponseType<Notice>> => {
    const response = await axiosInstance.get(`/notice/list`, {
        // axios 가 알아서 조립해준다.
        params: {
            page,
            size,
        }
    });
    return response.data.data;
}

export default {
    getNoticeById,
    getNoticeList,
};
    