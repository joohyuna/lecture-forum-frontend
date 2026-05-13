// Enum 타입

// enum 키워드를 통해서 타입을 작성하는 방법이 2년 전까지는 통용되었음
// enum GenderType {
// MALE = "MALE"
// FEMALE = "FEMALE"
// }

// 객체를 만든것이고 값이고
// Backend의 Prisma는 이것을 자동생성해준것이고
// frontend에서는 만들어 줘야함
export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
}

// 그에 대한 타입을 만든것임
export type GenderType  = typeof Gender[keyof typeof Gender];