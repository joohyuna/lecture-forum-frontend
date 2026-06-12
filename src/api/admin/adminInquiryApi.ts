import axiosInstance from "../axiosInstance.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import type { AdminInquiryAnswerInputType } from "../../schemas/admin/inquiry/admininInquiryAnswerSchema.ts";

const getInquiryList = async (page?: number, size?: number) => {
    const response = await axiosInstance.get(`/admin/inquiry/list`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getInquiryById = async (inquiryId: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/admin/inquiry/${inquiryId}`);
    return response.data.data;
};

// 답변 을 달때 모드 사용 , 생성 업데이트 모두
const updateInquiryAnswer = async (inquiryId: number, input: AdminInquiryAnswerInputType) => {
    const response = await axiosInstance.patch(`/admin/inquiry/${inquiryId}`, input);
    return response.data.data;
};

export default {
    getInquiryList,
    getInquiryById,
    updateInquiryAnswer
};
