const sgMail = require('@sendgrid/mail')
const sendGridApiKey = process.env.SENDGRIDAPI_KEY


sgMail.setApiKey(process.env.SENDGRIDAPI_KEY)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'hanuman@yopmail.com',
        subject : 'This is first createion',
        text : `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).then(() => {
        console.log('------- Email Send At-------------', new Date());
    }).catch((error) => {
        console.log(error);
    })
    
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'hanuman@yopmail.com',
        subject : 'This is first createion',
        text : `Sorry, ${name}. Let me know how you get feel bored.`
    }).then(() => {
        console.log('------- sendCancelationEmail Send At-------------', new Date());
    }).catch((error) => {
        console.log(error);
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
} 
