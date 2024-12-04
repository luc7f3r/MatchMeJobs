require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );
const { getFreeJobs } = require("../services/free_jobs");
const {filterJobsBy18Hours} = require("../services/filter_by_18");
const {sendEmail} = require("../services/email_service");
const {groupUsersByJobCategory}= require("../services/group_users");
const {setTimeout} = require("node:timers/promises");


async function getJobs(){
    try{
        const usersByCategory = await groupUsersByJobCategory();
        for (const categoryGroup of usersByCategory) {
            const category = categoryGroup.job_role;
            const users = categoryGroup.users;
            const level = categoryGroup.level;
            const jobs = await getFreeJobs(category,level);
            if(jobs == 0)
            {
                continue;
            }
            const filteredBy18hrs = await filterJobsBy18Hours(jobs);
            console.log("Job ran successfully for category: ", category);
            await setTimeout(10000);
            console.log('Sending Emails');
            for(const user of users){
                await setTimeout(10000);
            await sendEmail(filteredBy18hrs, category, user);
            }
        } 
            console.log('The batch was completed!')
            return {status:200, message:'All the Jobs were sent successfully'}; 
        // return res.status(200).json({msg:'All the Jobs were sent successfully!'});
    }
    catch(error){
        console.error("Error occurred in Job Controller");
        return {status:500, message:'Some error ocurred in job controller'};
        // return res.status(401).json({msg : "Didnt got the jobs"});
    }
};

module.exports = {getJobs};