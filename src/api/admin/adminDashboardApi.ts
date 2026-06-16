import axiosInstance from "../axiosInstance.ts";

const adminRecentList = async () => {
    const response = await axiosInstance.get("/admin/summary");
    return response.data.data;
};

export default {
    adminRecentList,
}