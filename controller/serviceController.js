const { name } = require('ejs');
const servicePlan = require ('../model/serviceModel')
const nodemailer = require('nodemailer');
const serviceModel = require('../model/serviceModel');

const serviceInsert = async (req, res) => {
    try {
        // Define the formatDate function to format dates as needed
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Create a new servicePlan document
        const insertServiceData = new servicePlan({
            name: req.body.name,
            phoneNumber: req.body.Phonenumber,
            placelocation: req.body.place,
            plan: req.body.plan,
            startDate: formatDate(req.body.startDate), // Format start date
            endDate: formatDate(req.body.endDate), // Format end date
            comment: req.body.comment
        });

        // Save the document to the database

        await insertServiceData.save();
        
        // Redirect to '/data' after successful save
        
        res.redirect('/data');
        
    } catch (error) {
        console.error('Error saving service data:', error);
        res.status(500).send('Internal Server Error');
    }
};










//LOGIN START
const loginLoad = async (req, res) => {
   
    try {
        
            res.redirect('/')
            return
        
        
    } catch (error) {
        console.log(error.message)
    }
}


const verifyLogin = async (req, res) => {
    try {
        const name1 = "example@gmail.com"; 
        const password1 = "12345"; 
        const name = req.body.email;
        const password = req.body.password;

        if (name    === name1 && password === password1) { 
            
            req.session.adminid = name;
            res.redirect('/');
        } else {
            res.render('login', { message: "Username or password is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

//DASHBOARD

const dashboard = async (req, res) => {
    try {
       
            const UsersData = await servicePlan.find({});
            res.render('dashboard', { Users: UsersData }); // Pass Users data to the dashboard template
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};





const userview = async (req, res) => {
    try {
        
            const servicedata = await servicePlan.find({});
            console.log("hello");
            res.render('tables', { dataservice: servicedata });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error'); 
    }
};

const redclient = async (req, res) => {
    try {
       
            const currentDate = new Date();
           
            const redData = await serviceModel.find({
                endDate: {
                    $lte: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days before current date
                }
            });
            console.log("okk", redData);
            res.render('red', { redData });
       
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error'); 
    }
};



//  delete service
const deleteservice = async (req, res) => {
    try {
        const deletedData = await servicePlan.findByIdAndDelete(req.params.id);
        if (!deletedData) {
            return res.status(404).send('Data not found'); // Respond with 404 if data not found
        }
        res.status(200).send('Data deleted successfully'); // Respond with success message
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const serviceEdit = async (req, res) => {
    try {
        console.log("hlooo");
        const _id = req.params.id;
        console.log(req.params); 
        console.log(req.body);
        const { editname, editPhonenumber, editplace, editplan, editstartDate, editendDate, editcomment } = req.body;

        // Update existing document
        const updatedServiceData = {
            name: editname,
            phoneNumber: editPhonenumber,
            placelocation: editplace,
            plan: editplan,
            startDate: editstartDate, 
            endDate: editendDate,
            comment: editcomment
        };

        // Find the document by _id and update it
        await serviceModel.findByIdAndUpdate(_id, updatedServiceData);

        // Redirect to '/data' after successful save or update
        res.redirect('/data');
    } catch (error) {
        console.error('Error saving or updating service data:', error);
        res.status(500).send('Internal Server Error');
    }
};







module.exports = {
    serviceInsert,
    verifyLogin,
    loginLoad,
    userview,
    deleteservice,
    dashboard,
    serviceEdit,
   redclient

}