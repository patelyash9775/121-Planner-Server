const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const nodemailer = require('nodemailer')

require('../db/conn');
const User = require('../model/userSchema');
const Meeting = require('../model/meetingSchema');
const Otp = require('../model/otp')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'emailsender881@gmail.com',
        pass: 'vjzriivrouldvxkr'
    }
});



router.get('/',(req,res)=>{
    res.send("Hello world from the server auth.js");
});

// using promises
// router.post('/register', (req,res)=> {

//     const {name,email,phone,work,password,cpassword} = req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"Pz filled the field properly"});
//     }
   
//     User.findOne({email:email})
//     .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({error:"Email already Exist"});
//         }

//     const user = new User({name,email,phone,work,password,cpassword});

//     user.save().then(() => {
//         res.status(201).json({message: "User registered successfuly"});
//     }).catch((err) => res.status(500).json({error:"Failed to registered"}));

//     }).catch(err => {console.log(err); });
// });

// Async-Await

router.post('/register', async (req,res)=> {

    const {name,username,email,phone,work,password,cpassword} = req.body;

    if(!name || !username || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Pz filled the field properly"});
    }
    try{
     const userExist = await User.findOne({email:email});
     const usernameExist = await User.findOne({username:username});

     if(userExist){
        return res.status(422).json({error:"Email already Exist"});
    }else if(usernameExist){
        return res.status(422).json({error:"Username already Exist"});
    }else if(password != cpassword){
        return res.status(422).json({error:"Password are not matching"});
    }
    else{
        const user = new User({name,username,email,phone,work,password,cpassword});
        await user.save();
        res.status(201).json({message:"user registered successfully"});

    }



    
    } catch(err){
        console.log(err);
    }
   
});

router.post('/SendRequest', async (req,res)=> {

    const {sender,username,date,location,restaurant,status,condition} = req.body;

 

    if(!sender || !username || !date || !location || !restaurant || !status || !condition){
        return res.status(422).json({error:"Pz filled the field properly"});
    }
    try{
     
       const meeting = new Meeting({sender,username,date,location,restaurant,status,condition});
        await meeting.save();
        res.status(201).json({message:"Request sent successfully"});

    } catch(err){
        console.log(err);
    }
   
});


let Email;

router.post('/Reset1',async (req,res)=>{
    // console.log(req.body);
    // res.json({message: "awesome"});
    try{
        const {email} = req.body;
        Email = email;

        if(!email){
            return res.status(400).json({error:"Plz filled the field properly"});
        }

        const userLogin = await User.findOne({ email:email });


        // console.log(userLogin);
        if(!userLogin){
            res.status(400).json({error: "Invalid Email"});
            }
        else{
                let otpcode = Math.floor((Math.random()*10000)+1);
                let otpData = new Otp({
                    email:email,
                    code:otpcode,
                    expireIn: new Date().getTime() + 300*1000
                })
                let otpResponse = await otpData.save();
                const mailOptions = {
                    from: 'emailsender881@gmail.com',
                    to: email,
                    subject: 'Your OTP',
                    text: 'Your OTP is ' + otpcode
                };

                transporter.sendMail(mailOptions, function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log('Email sent: '+info.response)
                        res.json({message: "Email verified and OTP has been sent"});
                    }
                })
            }


    }
    catch(err){
        console.log(err);
    }
});

router.post('/OtpVerify',async (req,res)=>{
 
    try{
        const {code} = req.body;
        const email = Email;
        
        let data = await Otp.find({email:email,code:code});
        console.log(data);
        if(data){
            let currentTime = new Date().getTime();
            let diff = data.expireIn - currentTime;
            if(diff<0){
                res.status(400).json({error: "Invalid OTP"});
                
            }
            else{
                res.json({message: "OTP verified"});
            }
        }
        else{
            res.status(400).json({error: "Invalid OTP"});
        }
   

    }
    catch(err){
        console.log(err);
    }
});

router.post('/ResetPass',async (req,res)=>{
 
    try{
        const {password} = req.body;
        const email = Email;
        let newPassword = password;
        console.log("new Password",newPassword,email);
        newPassword = await bcrypt.hash(newPassword,12);
        const result = await User.updateOne({email:email},{
            $set: {
                password: newPassword
            }
       
        });
        res.status(201).json({message:"Reset password successfully"});

    }
    catch(err){
        console.log(err);
    }
});





router.post('/signin',async (req,res)=>{
    // console.log(req.body);
    // res.json({message: "awesome"});
    try{
        const {email,password} = req.body;
        let token;

        if(!email || !password){
            return res.status(400).json({error:"Pz filled the field properly"});
        }

        const userLogin = await User.findOne({ email:email });


        // console.log(userLogin);
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);

            token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({error: "Invalid Credientials"});
            }
            else{
                res.json({message: "user signin successfully"});
            }

        }
       else{
            res.status(400).json({error: "Invalid Credientials"});
       }
       

    }
    catch(err){
        console.log(err);
    }
});

router.get('/about',authenticate,(req,res)=>{
  //  console.log("Hello my About");
    res.send(req.rootUser);
});

//get user data for contact us
router.get('/getdata',authenticate,(req,res)=>{
  //  console.log("Hello my About");
    res.send(req.rootUser);
});

router.post('/contact',authenticate,async (req,res)=>{
   try{
        const {name,email,phone,message} = req.body;

        if(!name || !email || !phone || !message){
           // console.log("error contact form");
            return res.json({error: "plss filled the context form"});
        }

        const userContact = await User.findOne({_id:req.userID});

        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);

            await userContact.save();

            res.status(201).json({message:"user Contact successfully"});
        }
   }
   catch(err){
    console.log(err);
   }
});

router.get('/logout',(req,res)=>{
    // console.log("Hello my logout page");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User logout');
});

router.get('/SendRequest',(req,res)=>{
    User.find({},{username:1, name: 1, work:1, email:1, phone: 1, _id:0}).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        console.log(err);
    });
});

router.get('/ReceiveRequest',async(req,res)=>{
    try {
        
        const meeting = await Meeting.find({},{sender:1, username: 1, date:1, location:1, restaurant: 1,status:1,condition:1, _id:1})
        const user = await User.find({},{username:1, name: 1, email:1, phone: 1, _id:0})
        res.status(200).send({meeting: meeting, user:user})
        // console.log(meeting, user)
    } catch (error) {
        console.log(error)
    }

});

router.get('/MeetingStatus',(req,res)=>{
    Meeting.find({},{sender:1, username: 1, date:1, location:1, restaurant: 1,status:1, _id:1}).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        console.log(err);
    });
});



router.post('/ReceiveRequest', async(req,res) => {
    try{
        const {id,status,condition} = req.body;
        // console.log("Yash Patel",id,status,condition)
        const result = await Meeting.updateOne({_id:id},{
            $set: {
                status: status,
                condition: condition
            }
        });
        res.status(201).json({message:"Response sent successfully"});
      
    } catch(error){
        console.log(error)
    }
})



module.exports = router;