// typescript 파일과 javascript 는 호환이 안됨
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// commonJS에서는 기본적으로 현재 경로를  __dirname 이라는 변수명 저장해 놓지만
// ES module에서는 제공하지 않아서 직접 만들어줘야 함
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

export const BASE_URL = process.env.VITE_API_BASE_URL;
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN;