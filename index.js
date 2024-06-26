// Import required modules
const express = require('express');
const session = require('express-session'); 
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const serviceController = require('./controller/serviceController');
const serviceModel = require('./model/serviceModel');
const ObjectId = mongoose.Types.ObjectId;
const puppeteer = require('puppeteer');
// const cors = require('cors');








const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Middleware setup
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true })); // Add session middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database connection
const dbUrl = "mongodb+srv://velvetek:R9DqURcSA71B1YQh@miracle.ju08hft.mongodb.net/greenberry";



mongoose.connect(dbUrl)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
  });

  app.get('/', async (req, res) => {
    try {
     
        const UsersData = await serviceModel.find({}).limit(10);
        const userCount = await serviceModel.countDocuments({});
  
        const currentDate = new Date();
  
        // Calculate counts based on proximity to end date
        const clientsByEndDateCount = {
          red: await serviceModel.countDocuments({
            endDate: {
              $lte: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days before current date
            }
          }),
          yellow: await serviceModel.countDocuments({
            endDate: {
              $gt: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000), // More than 5 days before current date
              $lte: new Date(currentDate.getTime() + 25 * 24 * 60 * 60 * 1000) // 25 days before current date
            }
          }),
          green: await serviceModel.countDocuments({
            endDate: {
              $gt: new Date(currentDate.getTime() + 25 * 24 * 60 * 60 * 1000) // More than 25 days before current date
            }
          })
        };
  
        // Adjust yellow count to exclude red clients
        clientsByEndDateCount.yellow -= clientsByEndDateCount.red;
        res.render('index', {
          Users: UsersData, // Assuming UsersData is defined earlier in your route handler
          userCount: userCount, // Assuming userCount is defined earlier in your route handler
          clientsByEndDateCount: {
              red: clientsByEndDateCount.red < 1 ? 0 : clientsByEndDateCount.red,
              yellow: clientsByEndDateCount.yellow < 1 ? 0 : clientsByEndDateCount.yellow,
              green: clientsByEndDateCount.green < 1 ? 0 : clientsByEndDateCount.green
          }
      }); 
        // console.log(clientsByEndDateCount, "hello");
      
    } catch (error) {
      console.error('Error rendering index:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.get('/logout', (req, res) => {
  
  req.session.destroy(err => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).send('Error destroying session');
      }
      
      res.redirect('/login');
  });
});


app.get('/add', (req, res) => {
  
    res.render('forms');
  
});

app.get('/login', (req, res) => {
    res.render('login');
});


app.get('/data', serviceController.userview);
app.get('/red', serviceController.redclient);
app.get('/yellow', serviceController.yellowclient);
app.get('/green', serviceController.greenclient);


// Example route definition for handling DELETE requests
app.delete('/delete/:id', serviceController.deleteService);


app.post('/submit', serviceController.serviceInsert);





app.post('/login', serviceController.verifyLogin); 

app.get('/userdata', serviceController.dashboard)



app.post('/editsubmit', async (req, res) => {
  try {
    const { editDataId, editName, editPhoneNumber, editLocation, editPlan, editStartDate, editEndDate } = req.body;

    if (!editDataId || !ObjectId.isValid(editDataId)) {
      return res.status(400).send('Invalid editDataId');
    }

    // Update document in MongoDB using Mongoose
    const updatedDocument = await serviceModel.findByIdAndUpdate(editDataId, {
      name: editName,
      phoneNumber: editPhoneNumber,
      placelocation: editLocation,
      plan: editPlan,
      startDate: editStartDate,
      endDate: editEndDate
    });

    if (!updatedDocument) {
      return res.status(404).send('Document not found');
    }

    res.status(200).send('Edit successful');
  } catch (error) {
    console.error('Error editing data:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'battlefieldguts1@gmail.com',
      pass: 'prqr xhuk gzyg iybc'
  }
});

// Function to send an email with client details
const sendEmail = async (details) => {
  try {
    const htmlContent = `
    <h1>Client Details</h1>
    <p>Name: ${details.name}</p>
    <p>Phone Number: ${details.phoneNumber}</p>
    <p>Location: ${details.placelocation}</p>
    <p>Plan: ${details.plan}</p>
    <p>Start Date: ${details.startDate}</p>
    <p>End Date: ${details.endDate}</p>
    <p>Comment: ${details.comment}</p>
  `;

      const mailOptions = {
          from: 'battlefieldguts1@gmail.com',
          to: 'greenberrygarden@gmail.com',
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





cron.schedule('0 12 * * *', async () => {
  try {
    const data = await serviceModel.find({});
    const clientDetails = data.length > 0 ? data[0] : {};

    if (Object.keys(clientDetails).length === 0) {
      console.error('No client details found in the database');
      return;
    }

    await sendEmail(clientDetails);
    console.log('Sending email at 12 PM');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});


app.post('/sendEmail', async (req, res) => {
  try {
    const requestData = req.body;

    // Iterate over each data entry received from the client
    for (const clientDetails of requestData) {
      if (Object.keys(clientDetails).length === 0) {
        console.warn('Skipping empty client details');
        continue; // Skip empty entries
      }

      // Send email for each clientDetails entry
      await sendEmail(clientDetails);
    }

    res.status(200).send('Email(s) sent successfully');
  } catch (error) {
    console.error('Error sending email(s):', error);
    res.status(500).send('Internal Server Error');
  }
});










// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
