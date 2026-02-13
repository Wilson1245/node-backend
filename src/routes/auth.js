const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// post /auth/register
router.post('/register', async(req, res, next) => {
    try {
        const {name, email, password} = req.body;

        // pwd crypt (second param is salt rounds)
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = await prisma.user.create({
            data: {name, email, password: hashedPassword}
        });

        // response without pwd
        const {password: _, ...userWithoutPassword} = user;
        res.status(201).json(userWithoutPassword);
    } catch(error) {
        if(error.code === 'P2002') {
            return res.status(409).json({error: 'Email already exists'});
        }
        next(error);
    }
})

// post /auth/login
router.post('/login', async(req, res, next) => {
    try {
        const {email, password} = req.body;

        // find user
        const user = await prisma.user.findUnique({
            where: {email}
        });
    
        // check pwd
        const isPwdValid = await bcrypt.compare(password, user.password);
        if(!isPwdValid) {
            return res.status(401).json({error: 'account or pwd is wrong'});
        }
    
        // create jwt token
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
    
        res.json(token);
    } catch (error) {
        next(error);
    }
})

module.exports = router;