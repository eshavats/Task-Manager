const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "esha.vats@somaiya.edu",
        subject: "Welcome to our App!",
        text: `We hope you have an amazing experience, ${name}!`
    });
};

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "esha.vats@somaiya.edu",
        subject: `Goodbye, ${name}.`,
        text: "We are disappointed to see you leave!"
    });
};

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
};