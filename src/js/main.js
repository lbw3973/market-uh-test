// dotenv 사용 예시
import dotenv from 'dotenv';
import { base_url, api_key, user_name, admin_email } from './db.js';
dotenv.config();

console.log('BASE_URL:', process.env.BASE_URL);
console.log('API_KEY:', process.env.API_KEY);
console.log('USER_NAME:', process.env.USER_NAME);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

console.log({ base_url, api_key, user_name, admin_email });
