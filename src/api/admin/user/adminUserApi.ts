import axiosInstance from "../../axiosInstance.ts";
import type { User } from "../../../types/user.type.ts";
import type { AdminCreateUserInputType } from "../../../schemas/admin/user/adminCreateUserSchema.ts";
import type { AdminUpdateUserInputType } from "../../../schemas/admin/user/adminUpdateUserSchema.ts";
import type {PaginationResponseType} from "../../../types/common.type.ts";

// Typescript는 외부와의 통신 때 도착되는 내용은 당연히 알 수 없음
// 함수 실해 결과가 그 외부와의 통신 내용을 return(반환)하는데 생략 해버리면 any타입이 되어버림 반드시 타입을 명시 생략할수 없다. axios
const fetchUserList = async (page: number, size: number): Promise<PaginationResponseType<User>> => {
    const response = await axiosInstance.get(`/admin/user/list?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/admin/user/${id}`);
    return response.data.data;
}

const createUser = async (data: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post("/admin/user/create", data);
    return response.data.data;
};

const updateUser = async (id: number, data: AdminUpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}`, data);
    return response.data.data;
}

const deleteUser = async (id: number): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}/delete`);
    return response.data.data;
}

export default {
    fetchUserList,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
};
