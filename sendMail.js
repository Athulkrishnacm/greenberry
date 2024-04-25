const nodemailer = require('nodemailer');
const serviceModel = require('./model/serviceModel'); // Import your Mongoose model

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'battlefieldguts1@gmail.com',
        pass: 'prqr xhuk gzyg iybc'
    }
});

const sendEmail = async (details) => {
    try {
        const clientDetails = await serviceModel.findOne({
            name: details.name,
            phoneNumber: details.phoneNumber,
            placelocation: details.placelocation,
            plan: details.plan,
            startDate: details.startDate,
            endDate: details.endDate,
            comment: details.comment
        });

        if (!clientDetails) {
            throw new Error('Client details not found in the database');
        }

        const htmlContent = generateEmailContent(clientDetails);

        const mailOptions = {
            from: 'battlefieldguts1@gmail.com',
            to: 'athul@velveteksystems.com',
            subject: 'Client Details',
            html: htmlContent
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);

        return info.response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};


module.exports = sendEmail,generateEmailContent;;
