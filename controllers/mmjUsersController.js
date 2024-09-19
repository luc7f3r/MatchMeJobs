// const mmj_user = require("../models/mmj_users")

// async function createNewMmjUser(req,res) {
//     console.log("Inside Create user")
//     const body = req.body;

//     if( !body.full_name || !body.email ||
//          !body.contact_number || !body.job_role || !body.level){
//             return res.status(400).json({msg : "Mandatory Fields are missing!!"})
//          }
//         try{
//     const newMmjUser = await mmj_user.create({
//         full_name : body.full_name,
//         email : body.email,
//         contact_number : body.contact_number,
//         job_role : body.job_role,
//         level : body.level
//     });
//         return res.status(201).json({msg: `${body.full_name} created successfully!`, id : newMmjUser._id});
//             }
//         catch(error){
//             console.log("Some error came in!");
//             return res.status(503).json({msg : "Some server-side error occurred. Please try after a min!"});
//         }
// };

// module.exports = {createNewMmjUser};
