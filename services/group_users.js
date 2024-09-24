const mongoose = require("mongoose");
const mmj_user = require("../models/mmj_users");

async function groupUsersByJobCategory(){
    const seekers = await mmj_user.aggregate([{$group:{_id: '$job_role', users:{$push:{email:'$email', name:'$full_name'}}}}]);
    return seekers;
}

module.exports ={groupUsersByJobCategory};