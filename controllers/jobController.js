const { getFreeJobs } = require("../services/free_jobs");
const {filterJobsBy18Hours} = require("../services/filter_by_18")


async function getJobs(req, res){
    try{
         const jobs = await getFreeJobs(req,res);
         const filteredBy18hrs = await filterJobsBy18Hours(jobs);
        return res.status(200).json({length : jobs.length,Jobs : filteredBy18hrs});
    }
    catch(error){
        console.error("Error occurred");
        return res.status(401).json({msg : "Didnt got the jobs"});
    }
};

module.exports = {getJobs};