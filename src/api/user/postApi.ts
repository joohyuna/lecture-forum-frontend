import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post } from "../../types/post.type.ts";

const fetchPostListByCategory = async (): Promise<PaginationResponseType<Post>> => {
    const response = await axiosInstance.get("/post/:categoryId");
    return response.data.data;
    
    }
    
    export default {
        fetchPostListByCategory,
    };