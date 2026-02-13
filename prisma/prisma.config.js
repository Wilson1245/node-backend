import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: {
    datasource: {
      // 這裡放入您之前的連線字串環境變數
      url: process.env.DATABASE_URL,
    },
  },
});