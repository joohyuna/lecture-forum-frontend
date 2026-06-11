import type { User } from "./user.type.ts";

export interface Inquiry {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    answer : string | null;
    answeredAt: string | null;
    userId: number;
    user: Pick<User, "id" | "nickname" | "email">;  // User라는 타입과 관계있는 값이 들어온다.


}

