const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json);
dotenv.config();

//console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((x) => {
        console.log("Connected to Mongo");
    }).catch((err) => {
        console.log("Error");
    });

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}))

const jwtSecret = process.env.JWT_SECRET;

app.get('/', (req, res) => {
    res.json("okdej");
});

app.get('/test', (req, res) => {
    res.json("ok");
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser = await User.create({ username, password });
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }
});
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})