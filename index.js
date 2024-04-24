// Import required modules
const express = require('express');
const session = require('express-session'); 
const bodyParser = require('body-parser');
 
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const serviceController = require('./controller/serviceController');
const serviceModel = require('./model/serviceModel');

const sendEmail =  require('./sendMail');

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

// Routes
app.get('/', async (req, res) => {
  try {
    if (req.session.adminid) {

      const UsersData = await serviceModel.find({}).limit(10);
      const userCount = await serviceModel.find({}).count();
      res.render('index', { Users: UsersData, userCount: userCount });
    } else {
      res.redirect('/login');
    }
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
  if( req.session.adminid){
    res.render('forms');
  }else{
    res.redirect('/login')
  }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/data', serviceController.userview);

app.post('/data/:id',serviceController.deleteservice)

app.post('/submit', serviceController.serviceInsert); 

app.post('/login', serviceController.verifyLogin); 

app.get('/userdata', serviceController.dashboard)


// Route to send email
app.post('/sendEmail', async (req, res) => {
  try {
      // Assuming req.body contains the client details
      const clientDetails = req.body;

      // Send email with client details using sendEmail function
      await sendEmail(clientDetails);

      res.status(200).send('Email sent successfully');
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
  }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
