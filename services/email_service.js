const nodemailer = require('nodemailer');
const ReactDOMServer = require('react-dom/server');
const React = require('react');
const { Container, Typography, Box, Link, List, ListItem, ListItemText } = require('@mui/material');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        // user:'animeshnrg500@gmail.com',
        // pass : 'ohik xwee ourq rbip'
         user:'matchmejobs@gmail.com',
        pass : 'ogrc reti egcy onqg'
    },
});

async function sendEmail(data, keyword, user){
    const {email,name} = user;
    const htmlContent = ReactDOMServer.renderToString(React.createElement(
        React.Fragment,
        null,
        // React.createElement(CssBaseline, null),
        React.createElement(
          Container,
          {
            maxWidth: 'sm',
            style: { fontFamily: 'Arial, sans-serif', lineHeight: '1.6',padding: '10px', backgroundColor: '#192024', maxWidth: '600px' }
          },
          React.createElement(
            Box,
            {
              style: { backgroundColor: '#FDFDFD', padding: "20px", borderRadius: '8px'}
            },
            React.createElement(
              Typography,
              { variant: 'h4', component: 'h4', gutterBottom: true, style:{color : '#318CE7', letterSpacing:10, textAlign: 'center', padding: "20px", fontWeight:'bold'} },
              'MATCH ME JOBS'
            ),
            React.createElement(
              Typography,
              { variant: 'body1', gutterBottom: true, style:{fontWeight:'bolder'}},
              `Hello ${name},`
            ),
            React.createElement(
              Typography,
              { variant: 'body1', paragraph: true},
              'This is your regular update with the most recent job opportunities that match your preferences, all posted in the last 18 hours. Staying ahead in your job search can make a significant difference, and we’re here to help you stay updated with the newest openings.'
            ),
            React.createElement(
              List,
              null,
              data.map((link, index) =>
                React.createElement(
                  ListItem,
                  {
                    key:index,
                    sx: {
                      justifyContent: 'center',
                      mb: 2, // Margin bottom for spacing between items
                      p: 2 // Padding inside the list item
                    }
                  },
                  React.createElement(
                    ListItemText,
                    null,
                    React.createElement(
                      Typography,
                      { variant: 'body1',style:{fontWeight:'bold'} },
                      link.company // Display the company name first
                    ),
                    React.createElement(
                      Link,
                      {
                        href: link.link,
                        target: '_blank',
                        style: { color: '#1a73e8', textDecoration: 'none' }
                      },
                      link.title // Make the title clickable as a link
                    ),
                    React.createElement(
                      Typography,
                      { variant: 'body2', style:{color : '#666362'} },
                      link.time
                    ),
                  )
                )
              )
            ),
            React.createElement(
              Typography,
              { variant: 'body1', paragraph: true},
              'Don’t miss out on these timely postings. Apply now to take the next step in your career journey!'
            ),
            React.createElement(
              Typography,
              { variant: 'body1', paragraph: true },
              'For any questions or additional support, feel free to reach out to us at matchmejobs@gmail.com.'
            ),
            React.createElement(
              Typography,
              { variant: 'body2',paragraph: true,style:{color:'#666362', fontWeight:'bolder',} },
              'May the right Opportunity find You,'
            ),React.createElement(
              Typography,
              { variant: 'body2',paragraph: true, style:{color : '#318CE7', fontWeight:'bold',letterSpacing:3}},
              'MATCH ME JOBS'
            ),
            React.createElement(
              Typography,
              { variant: 'body2', style: { marginTop: "5px", color: '#666'} },
              '© 2024 MATCH ME JOBS, all rights reserved.'
            )
          )
        )
      ));

    const mailOptions = {
        from:'matchmejobs@gmail.com',
        to:email,
        subject :`Latest ${keyword} Openings: Opportunities Posted in Last 18 Hours!`,
        // text:`${JSON.stringify(data,null,2)}`
        html: htmlContent
    };

    transporter.sendMail(mailOptions,(error,info) => {
        if(error){
            return console.log('Error while sending email',error);
        }
        console.log(`Email Sent Successfully for ${keyword}`+info.response)
    });
}

module.exports = {sendEmail}