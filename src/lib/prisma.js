const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config(); // 務必確保在 new Pool 之前載入 dotenv
// // 建立資料庫連線池
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// // 初始化適配器
// const adapter = new PrismaPg(pool);

// // 將適配器傳入 PrismaClient
// const prisma = new PrismaClient({ adapter });

// module.exports = prisma;
// 檢查環境變數是否存在
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

// 建議使用 connectionString 方式
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;