const { name } = require('ejs');
const servicePlan = require ('../model/serviceModel')
const nodemailer = require('nodemailer');


const serviceInsert = async (req, res) => {
    
    try {
        
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const day = String(date.getDate()).padStart(2, '0'); 
            return `${year}-${month}-${day}`;
        };

        const insertservicedata = new servicePlan({
            name: req.body.name,
            phoneNumber: req.body.Phonenumber,
            placelocation: req.body.place,
            plan: req.body.plan,
            startDate: formatDate(startDate), 
            endDate: formatDate(endDate), 
            comment: req.body.comment
        });

        await insertservicedata.save();
        res.redirect('/data');
        // console.log(insertservicedata, "Data saved successfully");

    } catch (error) {
        console.log(error);
    }
}










//LOGIN START
const loginLoad = async (req, res) => {
   
    try {
        if (req.session.adminid) {
            res.redirect('/')
            return
        }
        res.render('login', { message: '' })
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

        if (name === name1 && password === password1) { 
            
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
        if (req.session.adminid) {
            const UsersData = await servicePlan.find({});
            res.render('dashboard', { Users: UsersData }); // Pass Users data to the dashboard template
        } else {
            res.render('login', { message: 'Please Login ' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};





const userview = async (req, res) => {
    try {
        if (req.session.adminid) {
            const servicedata = await servicePlan.find({});
            res.render('tables', { dataservice: servicedata });
        } else {
            res.render('login', { message: '' });
        }
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
            return res.status(404).send('Data not found');
        }
        res.send('Data deleted successfully');
        window.location.reload();
    } catch (error) {
        console.error(error);
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
   

}