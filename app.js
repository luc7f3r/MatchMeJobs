require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const jobFetcher = require("./routes/jobs");
// const {connectMongoDB} = require("./connection");
// const mmj_user_routes = require("./routes/mmj_user_routes");
const cors = require("cors");

const PORT = process.env.PORT;
const app = express();

// connectMongoDB("mongodb://127.0.0.1:27017/matchmejobs").then(() =>
//     console.log("Connected to MongoDB"));


const corsOptions = {origin : true, credentials : true};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/fetch-job", jobFetcher);
// app.use("/mmj", mmj_user_routes);

app.listen(PORT, () =>{
    console.log(`Server started at ${PORT}`);
})
