import * as dotenv from 'dotenv';

export const BASE_URL = process.env.BASE_URL ?? '[NOT SET]';
export const USER_EMAIL = process.env.USER_EMAIL ?? '[NOT SET]';
export const USER_PASSWORD = process.env.USER_PASSWORD ?? '[NOT SET]';

async function globalSetup(): Promise<void> {
  dotenv.config({ override: true });
  console.log('URL:', process.env.BASE_URL);
}

export default globalSetup;
