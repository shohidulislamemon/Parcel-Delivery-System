const ejs= require("ejs");
const dotenv= require("dotenv");
const sendMail =require("../helpers/sendmail");
const User = require("../models/User");
const CryptoJS= require("crypto-js")

dotenv.config();
const sendWelcomeEmail = async()=>{
    const users=await User.find({status:0});

    if(users.length >0){
        for (let user of users){
            const hashedpassword =CryptoJS.AES.decrypt(user.password,process.env.PASS);
            const originalPassword=hashedpassword.toString(CryptoJS.enc.Utf8);

            ejs.renderFile(
                "templates/welcome.ejs",
                {fullname:user.fullname, password:originalPassword, email:user.email},
                (err,info)=>{
                    if(err){
                        console.log(err);
                    }
                }

            )
        }
    }
}


module.exports= {sendWelcomeEmail}