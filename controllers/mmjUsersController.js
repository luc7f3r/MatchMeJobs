const mmj_user = require("../models/mmj_users")

async function createNewMmjUser(req,res) {
    console.log("Inside Create user")
    const body = req.body;

    if( !body.full_name || !body.email ||
         !body.contact_number || !body.job_role || !body.level){
            return res.status(400).json({msg : "Mandatory Fields are missing!!"})
         }
        try{
    const newMmjUser = await mmj_user.create({
        full_name : body.full_name,
        email : body.email,
        contact_number : body.contact_number,
        job_role : body.job_role,
        level : body.level
    });
        console.log(`${body.full_name} created successfully!`);
        return res.status(201).json({msg: `${body.full_name} created successfully!`, id : newMmjUser._id});
            }
        catch(error){
            console.log("Some error came in!");
            return res.status(503).json({msg : "Some server-side error occurred. Please try after a min!"});
        }
};

async function unsubscribeUser(req,res){
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        const result = await mmj_user.updateMany(
            { email: email, subscribed : true},
            { 
                $set: { 
                    subscribed: false,
                    updatedAt: new Date() 
                }
            },
            { new: true }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subscribed user found with this email'
            });
        }

        console.log(`Successfully unsubscribed ${result.modifiedCount} user(s) with email: ${email}`);
        
        return res.status(200).json({
            success: true,
            message: 'Unsubscribed successfully',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error unsubscribing user:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe user',
            error: error.message
        });
    }
}

module.exports = {createNewMmjUser, unsubscribeUser};