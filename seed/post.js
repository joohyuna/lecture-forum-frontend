// 프론트엔드 입장에서 Post(글)에 대해서 등록을 시킴 seeding 작업 파일
// 백엔드에서 글 등록이라는 기능에 대해 생각해보면,
// 주소는 /post/create가 되어야하고, token 있어야 하고 , req.body에 필수값 3가지 선택값 2가지

import { ADMIN_TOKEN, BASE_URL } from "./config.js";

const POST_CREATE_URL = BASE_URL + "/post/create";

const mockPostList = [
    {
        title: "탕수육 먹을 때 소스는?",
        option1Text: "무조건 부먹",
        option2Text: "바삭하게 찍먹",
    },
    {
        title: "아이스 아메리카노 vs 따뜻한 아메리카노",
        option1Text: "얼죽아",
        option2Text: "쪄죽아",
    },
    {
        title: "치킨 먹을 때",
        option1Text: "닭다리부터",
        option2Text: "닭가슴살부터",
    },
    {
        title: "민트초코에 대한 당신의 견해는?",
        option1Text: "신의 음식 (극호)",
        option2Text: "치약의 맛 (극혐)",
    },
    {
        title: "평생 한가지만 먹어야 된다면",
        option1Text: "평생 짜장면만 먹기",
        option2Text: "평생 짬뽕만 먹기",
    },
    {
        title: "깻잎 논쟁, 내 연인이 친구의 깻잎을 떼어준다면?",
        option1Text: "매너일 뿐  괜찮아",
        option2Text: "절대 안됨 난리남",
    },
    {
        title: "새우는 논쟁, 내 연인이 새우를 까준다면?",
        option1Text: "새우 정도야",
        option2Text: "결별 사유임",
    },
    {
        title: "출근 시간이 정시 도착의 기준은?",
        option1Text: "9시 정각 문 통과",
        option2Text: "8시 50분 착석 완료",
    },
];

// 사용자 생성에 대해서 만들 때는, 그냥 api를 통해 바로 값을 집어넣어서 요청만 했으면 되는데,
// 글 생성이라는건 api에 요청을 하기 위해서는 글 정보 뿐만 아니라 categoryId가 필요함
// 물론, categoryId를 수동으로 (실행할 때) 집어 넣어서  요청하면 되겠지만
// category 정보도 읽어 들여서 자동으로 모든 카테고리에 글이 등록될 수 있도록 처리할 예정

// 1 파트 : 카테고리 목록를 불러오는 기능
// 2 파트 : 카테고릴 ID를 받아서 글을 등록하는 기능
// 3 파트: 1파트와 2파트를 묶어서 실행하는 메인함수

// 1 파트
// api 주소가 필요
const CATEGORY_LIST_URL = BASE_URL + "/category";

async function fetchCategories() {
    try {
        // axios 는 실패하면 바로 catch 절로 에러를 던지지만
        // fetch는 실패더라도 catch 절로 바로 가는게 아니라 response.ok 를 체크 해 줘야함
        // fetch는 성공된 내용일 자동으로 JSON  파싱되지 않음
        const response = await fetch(CATEGORY_LIST_URL);
        if (!response.ok) throw new Error("카테고리 목록을 불러오는데 실패했습니다.");
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.log("카테고리 조회중 에러 발생", error.message);
        return [];
    }
}

// 2 파트
async function generatePosts(categoryId, count) {
    for (let i = 0; i < count; i++) {
        try {
            // 글을 등록하도록 할텐데, 준비된 mockPostList에서 랜덤으로 골라서 글이 써지도록
            // Math.floor() : 소수점 이하 버림
            // Math.random() : 0 이상 1 미만의 랜덤 실수 반환
            // mockPostList.length = 7   *  0~1    => 최소 0부터 최대 6.xxxx  => 0 ~ 6
            const topic = mockPostList[Math.floor(Math.random() * mockPostList.length)];

            const dummyData = {
                title: topic.title,
                option1Text: topic.option1Text,
                option2Text: topic.option2Text,
                categoryId: categoryId,
                content:
                    "이 게시글은 토론 대난투 시스템을 검증하기 위해 생성된 자동화 테스트 글입니다.\n\n" +
                    "과연 여러분의 선택은 어느 쪽인가요?\n" +
                    `1번 ${topic.option1Text}과 2번 ${topic.option2Text}중 마음에 드는 진영에 투표하고` +
                    "아래 댓글 창에서 논리 제압을 시작해주세요",
            };

            const response = await fetch(POST_CREATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData),
            });
            if (!response.ok) {
                console.log(`[${i + 1}/${count} : 카테고리ID(${categoryId})] 생성 실패`);
            } else {
                console.log(`[${i + 1}/${count} : 카테고리ID(${categoryId})] 생성 성공`);
            }
        } catch (error) {
            console.log(`[${i + 1}/${count} : 카테고리ID(${categoryId})] 생성 실패`);
        }
    }
}

// 3 파트
async function runSeeder() {
    const categories = await fetchCategories();

    if (!categories || categories.length === 0) {
        console.log("카테고리 데이터를 불러오지 못했습니다. 시드 작업을 중단합니다.");
        return;
    }

    const postsPerCategory = 20;

    // 향상된 for문 중 forof   (array에서만 사용 가능) 우리가 map을 돌리는것 처럼
    // for에 들어있는 categories가 category에 들어간다.
    // for (const 함수몸통에서 이용할 변수 of for의 대상) {
    //      함수 몸통에서 for의 대상의 요소 가들어가는 "함수 몸통에서 이용할 변수"를 써 줄 수 있음
    // }
    for (const category of categories) {
        console.log(`카테고리ID(${category.id})에 대한 게시글 생성 작업을 시작합니다.`);
        await generatePosts(category.id, postsPerCategory);
    }

    console.log("모든 카테고리에 대한 게시글 시딩 작업이 완전히 종료 되었습니다.");
}


runSeeder().then(() => {});


// 프론트엔드에서는 백엔드에게 요청하는 seeding만 가능
// 백엔드에서는 token을 확인해서 처리를 하기 때문
// 프론트엔드에서의 seeding 작업은
// 결국 token이 제공되어야 하기 때문에
// 동일한 사용자로서만 사용이 가능해진다.

 // vote는 1인 1투표이기 때문에 프론트엔드에서는 seeding하기가 어려움
