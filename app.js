require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const jobFetcher = require("./routes/jobs")
const cors = require("cors");

const PORT = process.env.PORT;
const app = express();


const corsOptions = {origin : true, credentials : true};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/fetch-job", jobFetcher);

app.listen(PORT, () =>{
    console.log(`Server started at ${PORT}`);
})