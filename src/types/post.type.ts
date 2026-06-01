import type { User } from "./user.type.ts";

export interface Post {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    content: string;
    views: number;
    userId: number;
    categoryId: number;
    option1Text: string | null;
    option2Text: string | null;
    // Generic Type중 Pick 이라는 타입이 존재
    // Pick<해당 타입, 가져올 항목들>
    user: Pick<User, "id" | "nickname" | "email">;
    // vote라는 프로퍼티(항목)은
    // 글 내용에서만 있고, 글 목록에셔는 없는 항목임
    // 그렇기 때문에 union을 써서 null 일 수 있음을 고지
    vote: {
        option1Count: number;
        option2Count: number;
        totalCount: number;
        hasVoted: boolean;
    } | null;
}