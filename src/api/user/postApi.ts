import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { CreatePostInputType } from "../../schemas/post/createPostSchema.ts";

const fetchPostListByCategory = async (
    categoryId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<Post>> => {
    // 여기 내용은 초보가 하는 행동임 replyApi에 업그레이드 params 방식 으로 저장되어 있음
    const response = await axiosInstance.get(`/post/list/${categoryId}?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchPostById = async (id: number): Promise<Post> => {
    const response = await axiosInstance.get(`/post/${id}`);
    return response.data.data;
};

const createPost = async (data: CreatePostInputType) => {
    const response = await axiosInstance.post(`/post/create`, data);
    return response.data.data;
};

const votePost = async (postId: number, option: number) => {
    await axiosInstance.post(`/post/${postId}/vote`, { option });
    // 백엔드가 처리후 응답(Response)하는 내용이 필요없으면 return 안해도 됨
};

// 주소는 같아도 다른 동작 delete
const cancelVotePost = async (postId: number) => {
    await axiosInstance.delete(`/post/${postId}/vote`);
};

export default {
    fetchPostListByCategory,
    createPost,
    fetchPostById,
    votePost,
    cancelVotePost,
};
