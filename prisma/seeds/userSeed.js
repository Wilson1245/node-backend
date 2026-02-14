const prisma = require('../../src/lib/prisma');
const userData = require('./users.json');
const bcrypt = require('bcrypt');

async function main() {
    console.log('user seed start')

    // console.log('正在清除舊資料...')
    // await prisma.user.deleteMany({});

    console.log(`導入會員資料，共計 ${userData.length} 筆...`);

    console.log(`正在加密 ${userData.length} 筆會員密碼...`);
    // 1. 批次處理加密：將原始資料轉換為含加密密碼的新陣列
    const encryptedUsers = await Promise.all(
        userData.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            return {
                ...user,
                password: hashedPassword,
            };
        })
    );

    const result = await prisma.user.createMany({data: encryptedUsers, skipDuplicates: true});

    console.log(`user seed success, 共計新增 ${result.count}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });