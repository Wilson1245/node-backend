const {z} = require('zod');

const updateUserSchema = z.object({
    name: z.string()
        .min(2, '名字至少 2 個字')
        .max(50, '名字最多 50 個字')
        .optional(),
    email: z.string()
        .email('請輸入有效的 Email')
        .optional(),
}).refine(data => Object.keys(data).length > 0 , {
    message: '至少需要提供一個欄位'
});

module.exports = {updateUserSchema};