const mongoose = require("mongoose");
const mmj_user = require("../models/mmj_users");

async function groupUsersByJobCategory(){
    const seekers = await mmj_user.aggregate([{
      $match: { subscribed: true },
    },{$group:{_id: {job_role :'$job_role', level : '$level'}, users:{$push:{email:'$email', name:'$full_name'}}}},
        {
            $project: {
              job_role: "$_id.job_role",
              level: "$_id.level",
              users: 1,
              _id: 0
            }
          }
    ]);
    return seekers;
}


module.exports ={groupUsersByJobCategory};