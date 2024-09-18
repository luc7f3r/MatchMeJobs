const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'animeshnrg500@gmail.com',
        pass : 'ohik xwee ourq rbip'
    },
});

function sendEmail(data, keyword){
    const mailOptions = {
        from:'animeshnrg500@gmail.com',
        to:'animeshnrg500@gmail.com',
        subject :`${keyword} Jobs - Presented by MMJ`,
        text:`${JSON.stringify(data,null,2)}`
    };

    transporter.sendMail(mailOptions,(error,info) => {
        if(error){
            return console.log('Error while sending email',error);
        }
        console.log(`Email Sent Successfully for ${keyword}`+info.response)
    });
}

module.exports = {sendEmail}