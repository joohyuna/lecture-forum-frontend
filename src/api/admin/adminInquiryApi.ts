import axiosInstance from "../axiosInstance.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";


const getInquiryList = async (page?: number, size?: number) => {
    const response = await axiosInstance.get(`/admin/inquiry/list`, {
        params: {
            page,
            size,
        }
    })
    return response.data.data;
}

const getInquiryById = async (inquiryId: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/admin/inquiry/${inquiryId}`);
    return response.data.data;
};



export default {
    getInquiryList,
    getInquiryById,
};