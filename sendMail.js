const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'battlefieldguts1@gmail.com',
        pass: 'prqr xhuk gzyg iybc' // Replace with your Google app password
    }
});

// Define the sendEmail function only if it's not already declared
if (!global.sendEmail) {
    global.sendEmail = async (details) => {
        try {
            // Email content
            const mailOptions = {
                from: 'battlefieldguts1@gmail.com',
                to: 'athul@velveteksystems.com', // Change to your email address
                subject: 'Client Details',
                html: `
                    <p><strong>Name:</strong> ${details.name}</p>
                    <p><strong>Phone Number:</strong> ${details.phoneNumber}</p>
                    <p><strong>Location:</strong> ${details.placelocation}</p>
                    <p><strong>Plan:</strong> ${details.plan}</p>
                    <p><strong>Start Date:</strong> ${details.startDate}</p>
                    <p><strong>End Date:</strong> ${details.endDate}</p>
                    <p><strong>Comment:</strong> ${details.comment}</p>
                `
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            return info.response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    };
}

// Export the sendEmail function
module.exports = global.sendEmail;
