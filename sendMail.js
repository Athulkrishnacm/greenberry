// const serviceModel = require('./model/serviceModel'); 
// const nodemailer = require('nodemailer');

// // Create a Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'battlefieldguts1@gmail.com',
//         pass: 'prqr xhuk gzyg iybc'
//     }
// });

// // Function to fetch email data from the database
// const getEmailData = async () => {
//     try {
//         const data = await serviceModel.find({}).limit(1).exec();
//         return data;
//     } catch (error) {
//         console.error('Error fetching email data:', error);
//         throw error;
//     }
// };

// // Function to send an email with client details
// const sendEmail = async (details) => {
//     try {
//         const clientDetails = await serviceModel.findOne({
//             name: details.name,
//             phoneNumber: details.phoneNumber,
//             placelocation: details.placelocation,
//             plan: details.plan,
//             startDate: details.startDate,
//             endDate: details.endDate,
//             comment: details.comment
//         });

//         if (!clientDetails) {
//             throw new Error('Client details not found in the database');
//         }

//         const htmlContent = generateEmailContent(clientDetails); // Define generateEmailContent function

//         const mailOptions = {
//             from: 'battlefieldguts1@gmail.com',
//             to: 'athul@velveteksystems.com',
//             subject: 'Client Details',
//             html: htmlContent
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);

//         return info.response;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };

// module.exports = {
//     sendEmail,
//     getEmailData
// };
