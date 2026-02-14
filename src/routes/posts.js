const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

const validate = require('../middleware/validate');
const {createPostSchema, updatePostSchema} = require('../validators/postValidator');

// create post
router.post('/', validate(createPostSchema), async (req, res, next) => {
    try {
        const {title, content} = req.body;
        const userId = req.user.userId;
        const post = await prisma.post.create({
            data: {
                title,
                content,
                author: {
                    connect: {id: userId}
                }
            }
        });
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
});

// find all post
router.get('/', async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

// find post by id
router.get('/:id', async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({where: {id: Number(req.params.id)}});
        if (!post) {
            return res.status(404).json({error: "not found post"});
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
});

// delete post
router.delete('/:id', async (req, res, next) => {
    try {
        await prisma.post.delete({where: {id: Number(req.params.id)}});
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

// find post by user id
router.get('/user/:id', async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({where: {authorId: Number(req.params.id)}});
        if (posts.length === 0) {
            return res.status(404).json({error: "not found post"});
        }
        res.json(posts);
    } catch (error) {
        next(error);
    }
});

// update post
router.put('/:id', validate(updatePostSchema), async (req, res, next) => {
    try {
        const old = await prisma.post.findUnique({where: {id: Number(req.params.id)}});
        if (!old) return res.status(404).json({error: "not found post"});
        const {title, content} = req.body;
        const post = await prisma.post.update(
            {
                where: {id: Number(req.params.id)},
                data: {title, content}
            });
        res.json(post);
    } catch (error) {
        next(error);
    }
})

module.exports = router;