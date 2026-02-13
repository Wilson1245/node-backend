require('dotenv').config();
const express = require('express');
const userRouters = require('./routes/users');
const authRouters = require('./routes/auth');

const app = express();

app.use(express.json())

// routers
app.use('/auth', authRouters);
app.use('/users', userRouters);

// globol error
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ error: 'server error'});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});