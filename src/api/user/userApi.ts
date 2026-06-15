import axiosInstance from "../axiosInstance.ts";
import type { UpdateUserInputType } from "../../schemas/user/updateSchema.ts";
import type { UpdatePasswordInputType } from "../../schemas/user/updatePasswordSchema.ts";

const updateUser = async (data: UpdateUserInputType) => {
    const response = await axiosInstance.patch("/user/update", data);
    return response.data.data;
};

const updatePassword = async (data: UpdatePasswordInputType) => {
    await axiosInstance.patch("/user/update", data);
}

export default { updateUser,
updatePassword,
};
