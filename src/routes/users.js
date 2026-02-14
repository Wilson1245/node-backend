const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const validate = require('../middleware/validate');
const {updateUserSchema} = require('../validators/userValidator');

// GET /users
router.get('/', async (req, res, next) => {
    try {
        // 解析 query 參數，設定預設值
        const page = Math.max(1, parseInt(req.query.page || '1')); // Math.max(1) 最小為1
        const limit = Math.min(100, parseInt(req.query.limit || '10')); // Math.min(100) 最大為100
        const skip = (page - 1) * limit;
        const search = req.query.search?.trim() || '';

        // 建立 where 條件（有 search 才篩選）
        const where = search
            ? {
                OR: [
                    {name: {contains: search, mode: 'insensitive'}}, // insensitive 搜尋不分大小寫
                    {email: {contains: search, mode: 'insensitive'}}
                ]
            } : {};

        // const users = await prisma.user.findMany({
        //     include: {posts: true} // 同時撈出關聯的posts
        // });
        // res.json(users);

        // 同時查資料和總筆數（用 Promise.all 平行執行，效能更好）
        const [users, total] = await Promise.all([ // all : 查資料和計總數同時進行，比先後執行快一倍
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {id: 'desc'},
                select: { // 明確指定回傳欄位，避免不小心把 password 送出去
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                }
            }),
            prisma.user.count({where})
        ]);

        // 回傳資料 + 分頁資訊
        res.json({
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        next(error);
    }
})

// GET find by user id
router.get('/:id', async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {id: Number(req.params.id)},
            include: {posts: true}
        });

        if (!user) {
            return res.status(404).json({error: "not found user"});
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
})

// PUT update user
router.put('/:id', validate(updateUserSchema), async (req, res, next) => {
    try {
        const {name, email} = req.body;
        const user = await prisma.user.update({
            where: {id: Number(req.params.id)},
            data: {name, email}
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
})

// delete user
router.delete('/:id', async (req, res, next) => {
    try {
        await prisma.user.delete({
            where: {id: Number(req.params.id)}
        })

        res.status(204).send();
    } catch (error) {
        next(error);
    }
})

module.exports = router;