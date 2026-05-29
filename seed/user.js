// 사용자 정보를 집어넣는 seed 파일
// seed/user.js
// vite를 통해 실행한 리액트와의 별개의 파일 (package.json)은 실행할 때 실행 폴더에 존재하기 때문에 같이 씀
// 환결설정 파일(.env)를 불러오기 위해 백엔드에서 썱던 것 처럼 dotenv라이브러리를 설치해서 사용할 것임
// 어디에서 쓸거야 javascript(Typescript X)에서 아숑하기 위해 => @types/dotenv깔아주지 않아도 됨
// pnpm install dotenv 설치

// 경로에 대한 이해
// 이 파일은 프로그램 실행하는 위치 루트(최상단) 폴더가 되고
// 파일이 존재하는 위치는 /seed/user.js에 위치. 이파일의 입장에서 .env 파일의 위치 표현은 ../.env

// typescript에서는 파이브러리를 불러올 때 import키워드를 썼었음
// javascript에서는 require() 메서드를 통해 불러와야 함
// 그리고 javascript에서 파일에 대한 경로를 사용하려면, path라고 하는 기본 라이브러리를 써야함
// const path = require("path");  // import path from "path";
//const dotenv = require("dotenv");
// dotenv를 통해 환경변수 파일ㅇ르 불러오는데, 매개변수에 옶녀 객체를 넣어 설정을 해줄 수 있음
// 터미널 node install dotenv 설치
// path라는 라이브러리를 통해 __dirname (현재 경로 위치값에 저장되어 잇는 기본 변수) 와 "../.env"를
// 합쳐서 (join) 넣어줌

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";


// commonJS에서는 기본응로 현재 경로를  __dirname 이라른 변수엥 저장해 놓지만
// ES module에서는 제공하지 않아서 직점 만듥어줘야 함
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env")});


const BASE_URL = process.env.VITE_API_BASE_URL;
const API_URL = BASE_URL + "/admin/user/create";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

async function generateUser(count) {
    // 들어온 매개변수 count 만큼 회원 생성 요청을 백엔드에게 보내야 함
    for (let i = 0; i < count; i++) {
        try {
            // fetch(전송해야하는 URL, 옵션)
            // 옴션은 객체이고, 그 안에 method, headers, body가 들어감

            // username이나 name, nickname, email을 겹치는 값이면 안됨, unique여야 하니깐
            // 뒤에 들어갈 단어는 "겹치지 않는 값"을 붙여야 하므로
            // 손쉽게 만드는 방법은 지금 현재 시간을 쓸 수 있음
            // 사실 i를 쓰면 되는데 예는 재실행 하면 겹쳐버림
            // 그리고, username은 10자 제한 있음
            // 그리고  Javascript에는 random이라는 메서ㅏ드로 존재함

            // 날짜를 사용하는 방법을 한다면
            // .Date.now() : 현재 시간을 구함
            // .toString(): 문자열 변환
            // .slice(-3): 마지막 5자리만 가져옴
            // +i : i를 붙여서 겹치지 않는 값으로 만듦 (덧셉 X)
            //const unique = Date.now().toString().slice(-3) + i;

            // random 사용하는 방법을 한다면
            // Math.random() : 랜덤한 숫자를  만드는 메서드
            // .toString(숫자) : 숫자 진법을 통해 string으로 변환  => 36진법은 0~9, a~z끼지 사용 가능
            // 메소드 체인 레고같이 조립하는 것이다.
            const unique = Math.random().toString(36).slice(-3);

            const dummyData = {
                username: `user_${unique}`,
                password: "password123",
                name: `유저${unique}`,
                nickname: `닉네임_${unique}`,
                email: `user_${unique}@test.com`,
                gender: "MALE",
                role: "USER",
            };
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData), // JSON.stringify는 Javascript의 객체을 JSON 형태롤 변환
            });
            console.log(`[${i + 1}/${count}] ${response.ok ? "성공" : "실패"} / ${unique}`);
        } catch (error) {
            console.log(error);
        }
    }
}

// 문법때문에 then의 문법을 써준것임
generateUser(3).then(() => {});
