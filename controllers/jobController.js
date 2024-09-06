const { getFreeJobs } = require("../services/free_jobs");


async function getJobs(req, res){
    try{
         const abc = await getFreeJobs(req,res);
        return res.status(200).json({length : abc.length,Jobs : abc});
    }
    catch(error){
        console.error("Error occurred");
        return res.status(401).json({msg : "Didnt got the jobs"});
    }
};

module.exports = {getJobs};