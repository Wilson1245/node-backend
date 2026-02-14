const {z} = require('zod');

const registerSchema = z.object({
    name: z.string()
        .min(2, '名字至少兩個字')
        .max(50, '名字最多50個子'),
    email: z.string()
        .email('請輸入有效email'),
    password: z.string()
        .min(6, '密碼至少 6 個字元')
        .max(100, '密碼最多 100 個字元')
});

const loginSchema = z.object({
    email: z.string().email('請輸入有效email'),
    password: z.string().min(1, '請輸入密碼')
})

module.exports = {registerSchema, loginSchema};