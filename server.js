require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
const redis = require('redis');
const mongoose = require('mongoose');
const lt = require('@porla/libtorrent');
const fs = require('fs');


// Connect to Redis
// const redisSession = redis.createClient(
//     process.env.REDIS_PORT,
//     process.env.REDIS_HOST,
//     {
//         db: 0
//     }
// );

// redisSession.on('error', (err) => {
//     console.log(
//         `${chalk.red("✗ " + err)}`
//     )
// })

// redisSession.on("connect", () => {
//     console.log(
//         `${chalk.green("✓")} Connected to ${chalk.green("Redis")}`
//     );
// });

// Connect to MongoDB
mongoose.connect('mongodb://' + process.env.POLY_MONGO_USER + ':' + process.env.POLY_MONGO_PASS + '@' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.POLY_MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const mongoConn = mongoose.connection;

mongoConn.on("disconnected", (err) => {
    console.log(
        `${chalk.red("✗ " + "MongoDB disconnected... Retrying....")}`
    );
});

mongoConn.on("error", (err) => {
    console.log(
        `${chalk.red("✗ " + "Could not connect to MongoDB: " + err.message)}`
    );
    process.exit(0);
  });

mongoConn.on('open', () => {
    console.log(
        `${chalk.green("✓")} Connected to ${chalk.green("MongoDB")}`
    )
})


const api = require('./api/api');
const PORT = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

app.listen(PORT, function () {
    console.log(`Server Listing on ${PORT}`);
});