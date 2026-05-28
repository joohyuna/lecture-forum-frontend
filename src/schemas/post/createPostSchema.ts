import { z } from "zod";

// 백엔드에서 제공되었던 schema와 프론트엔드에서 사용해야 할 schema는 다른 지정이 있음
// option1Text가 사용자가 입력햇다면, option2Text도 존재하는지 체크해줘야 함

// 회원가입시 password 항목과 passwordConfirm 항몰이 값이 같은지 체크 했던거랑 비슷함
export const createPostSchema = z
    .object({
        title: z
            .string()
            .min(1, "제목을 입력해주세요")
            .max(255, "제목을 255자를 넣을 수 없습니다."),
        content: z.string().min(1, "내용을 입력해주세요"),
        categoryId: z.number().positive("유효한 카테고리 ID가 필요합니다."),
        option1Text: z.string().max(50, "투표 선택지 내용은 50자 이하고 입력해주세요").optional(),
        option2Text: z.string().max(50, "투표 선택지 내용은 50자 이하고 입력해주세요").optional(),
    })
    .refine(
        data => {
            const hasOpt1 = !!data.option1Text?.trim();
            const hasOpt2 = !!data.option2Text?.trim();
            return hasOpt1 && hasOpt2;
        },
        {
            path: ["root"],
            message: "투표 기능을 사용하려면 1번과 2번 항목을 모두 입력해야 합니다.",
        },
    );
export type CreatePostInputType = z.infer<typeof createPostSchema>;
