require('dotenv').config();
const express = require('express');
const userRouters = require('./routes/users');
const authRouters = require('./routes/auth');
const postRouters = require('./routes/posts');
const authenticate = require('./middleware/authenticate');

const app = express();

app.use(express.json())

// routers
app.use('/auth', authRouters);
app.use('/users', authenticate, userRouters);
app.use('/posts', authenticate, postRouters);

// globol error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({error: 'server error'});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});