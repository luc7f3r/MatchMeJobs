require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );
const { getFreeJobs } = require("../services/free_jobs");
const {filterJobsBy18Hours} = require("../services/filter_by_18");
const {sendEmail} = require("../services/email_service");
const {groupUsersByJobCategory}= require("../services/group_users");
const {setTimeout} = require("node:timers/promises");
const { getFreeJobsBuiltin } = require("../services/free_jobs_builtin");
const {filterJobsWithin48Hours} = require("../services/filter_by_48");


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
                console.log(`No jobs found for category: ${category}`);
                await setTimeout(30000);
                // continue;
            }
            // if(jobs !=0){
            // const filteredBy18hrs = await filterJobsBy18Hours(jobs);
            // }
            console.log("LinkedIn Job ran successfully for category: ", category);
            const builtinJobs = await getFreeJobsBuiltin(category,level);
            if(builtinJobs == 0)
                {
                    console.log(`No jobs found for category: ${category}`);
                    await setTimeout(30000);
                    // continue;
                }
            if( builtinJobs == 0 && jobs == 0)
            {
                continue;
            }
            else{
            var filteredBy18hrs;
            var combinedJobs;
             if(jobs !=0){
            filteredBy18hrs = await filterJobsBy18Hours(jobs);
            combinedJobs = filteredBy18hrs;
            }
            // const filteredBy18hrs = await filterJobsBy18Hours(jobs);
            var filteredBy48hrs =0; 
            if(builtinJobs != 0)
            {
                filteredBy48hrs = await filterJobsWithin48Hours(builtinJobs);
            }
            
            if( (filteredBy18hrs != 0 || filteredBy18hrs != "") && (filteredBy48hrs != 0 || filteredBy48hrs != ""))
            {
                combinedJobs = filteredBy18hrs.concat(filteredBy48hrs);
            }
            if( (filteredBy18hrs == 0 || filteredBy18hrs == "") && (filteredBy48hrs != 0 || filteredBy48hrs != ""))
                {
                    combinedJobs = filteredBy48hrs;
                }
            
            // const combinedJobs = [...filteredBy18hrs, ...filteredBy48hrs];
            console.log(combinedJobs);
            await setTimeout(10000);
            console.log('Sending Emails');
            for(const user of users){
            await sendEmail(combinedJobs, category, user);
            console.log(`Email sent to user: ${user.email} for category: ${category}`);
            await setTimeout(10000);
            }
            console.log(`Waiting before processing the next category...`);
            await setTimeout(30000);
            filteredBy18hrs = "";
            filteredBy48hrs = "";
            // combinedJobs ="";
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