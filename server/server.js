const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const { app, server } = require('./socket');

app.use(cors({
    origin: 'https://telehub.id.vn'
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// mongodb atlas connect
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { dbName: 'telehub' });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB Cloud connection established successfully");
})

// routing
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const groupRoute = require('./routes/group.route');
const callRoute = require('./routes/call.route');
const chatRoute = require('./routes/chat.route');

const verifyJWT = require('./middlewares/verifyJWT');

app.use('/api/auth', authRoute);
app.use('/api/user', verifyJWT, userRoute);
app.use('/api/group', verifyJWT, groupRoute);
app.use('/api/call', verifyJWT, callRoute);
app.use('/api/chat', verifyJWT, chatRoute);

const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "./client/build");

app.use(express.static(buildPath))

app.get(/^\/(?!api).*/, function (req, res) {
    res.sendFile(
        path.join(__dirname, "./client/build/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
})

// server host
const port = process.env.PORT;
const ip = process.env.IP;

server.listen(port, ip, () => {
    console.log(`Server is running at ${ip}:${port}`);
})