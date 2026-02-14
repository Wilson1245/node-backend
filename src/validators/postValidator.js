const {z} = require('zod');

const createPostSchema = z.object({
    title: z.string()
        .min(5, '標題最少五個字')
        .max(50, '標題最多50個字'),
    content: z.string()
        .min(10, '內容至少10個字')
        .max(500, '內容最多500個字')
});

const updatePostSchema = z.object({
    title: createPostSchema.shape.title.optional(),
    content: createPostSchema.shape.content.optional()
}).refine(data => Object.keys(data).length > 0, {
    message: '至少需要提供一個欄位'
});

module.exports = {createPostSchema, updatePostSchema};