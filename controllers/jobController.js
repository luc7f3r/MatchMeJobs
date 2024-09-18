const { getFreeJobs } = require("../services/free_jobs");
const {filterJobsBy18Hours} = require("../services/filter_by_18");
const {sendEmail} = require("../services/email_service");


async function getJobs(req, res){
    try{
        const {keywords} = req.body;
        console.log(keywords);
         const jobs = await getFreeJobs(req,res);
         const filteredBy18hrs = await filterJobsBy18Hours(jobs);
         console.log("Job ran successfully!")
         sendEmail(filteredBy18hrs, keywords);
        return res.status(200).json({length : filteredBy18hrs.length,Jobs : filteredBy18hrs});
    }
    catch(error){
        console.error("Error occurred");
        return res.status(401).json({msg : "Didnt got the jobs"});
    }
};

module.exports = {getJobs};