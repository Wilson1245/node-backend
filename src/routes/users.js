const authenticate = require('../middleware/authenticate')
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.use(authenticate);

// GET /users
router.get('/', async(req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            include: {posts: true} // 同時撈出關聯的posts
        });
        res.json(users);
    } catch(error) {
        next(error);
    }
})

// GET find by user id
router.get('/:id', async(req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.id) },
            include: { posts: true }
        });

        if (!user) {
            return res.status(404).json({ error: "not found user"});
        }

        res.json(user);
    } catch(error) {
        next(error);
    }
})

// POST create user
router.post('/', async(req, res, next) => {
    try {
        const {name, email} = req.body;
        const user = await prisma.user.create({
            data: {name, email}
        });
        
        res.status(201).json(user);
    } catch(error) {
        // check log
        console.log('error.code:', error.code);
        console.log('error.constructor.name:', error.constructor.name);

        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email is exists'});
        }
        next(error);
    }
})

// PUT update user
router.put('/:id', async(req, res, next) => {
    try {
        const {name, email} = req.body;
        const user = await prisma.user.update({
            where: {id: Number(req.params.id)},
            data: {name, email}
        });

        res.json(user);
    } catch(error) {
        next(error);
    }
})

// delete user
router.delete('/:id', async(req, res, next) => {
    try {
        await prisma.user.delete({
            where: {id: Number(req.params.id)}
        })
        
        res.status(204).send();
    } catch(error) {
        next(error);
    }
})

module.exports = router;