import { z } from "zod";
import { Gender, Role } from "../../../types/user.type.ts";


export const adminCreateUserSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(6),
    name: z.string().min(2),
    nickname: z.string().min(2).max(10),
    email: z.email(),
    phoneNumber: z.string().optional(),
    birthdate: z.string().optional(),
    gender: z.enum(Gender),

    // 관리자가 생성을 할때에는 role도 선택가능하게끔 넣어줘야한다.
    role: z.enum(Role),
});

export type AdminCreateUserInputType = z.infer<typeof adminCreateUserSchema>;
