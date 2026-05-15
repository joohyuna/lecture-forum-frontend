// Enum 타입

// enum 키워드를 통해서 타입을 작성하는 방법이 2년 전까지는 통용되었음
// 이렇게 만든 GenderType은 객체도 되고, 타입도 되었음
// 객체(값)으로 사용랄 때에은 GenderType.MALE
//타입으로 사용할 때는 GenderType
// 그런데 객체이면서 타입일수는 없어서 이렇게 사용하지 않음
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
// typeof 키워드 : 해당 변수의 타입을 반환 JavaScript에서 사용하는 키워드이기 때문에 원시타입과 그리고 object타입이로 나온다.
// keyof 키워드 : 해당 캑체의 키를 반환


// role enum
export const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
}

export type RoleType  = typeof Role[keyof typeof Role];