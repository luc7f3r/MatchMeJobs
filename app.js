require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const jobFetcher = require("./routes/jobs");
const {connectMongoDB} = require("./connection");
const mmj_user_routes = require("./routes/mmj_user_routes");
const cors = require("cors");
const cron = require("node-cron");
const {getJobs} = require("./controllers/jobController");


const PORT = process.env.PORT;
const app = express();

connectMongoDB("mongodb+srv://animeshnrg500:euiyDPrwFpSP73A7@cluster-mmj.4epj3.mongodb.net/matchmejobs?retryWrites=true&w=majority&appName=Cluster-MMJ").then(() =>
    console.log("Connected to MongoDB"));


const corsOptions = {origin : true, credentials : true};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/fetch-job", jobFetcher);
app.use("/api/mmj", mmj_user_routes);
cron.schedule('30 12 * * *', async (req, res) => {
    try {
       console.log("Starting the Application");
      const result = await getJobs();
        console.log("Jobs Fetched successfuly!");
    } catch (error) {
        console.log("Error running the jobs :", error);
        
    }
})

app.listen(PORT, () =>{
    console.log(`Server started at ${PORT}`);
})
