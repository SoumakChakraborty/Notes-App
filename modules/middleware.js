const sha1=require("sha1");
const mysql=require("mysql");
let emailjs=require("emailjs");
let middle={};
middle.isLoggedIn=(req)=>{
    let state=req.session.uname;
    if(state==undefined)
      return false; 
   return true;
};
middle.encrypt=(data)=>{
    let enc=sha1(data);
    enc=sha1("P"+enc+"D");
  return enc;
};
middle.connection=function()
{
      return mysql.createConnection({
        host:"localhost",
        port:"3306",
        user:"root",
        password:"Windows90#",
        database:"notes"    
    });
};
middle.emailconnection=()=>{
     return emailjs.server.connect({
           user:"yelpcamp500@gmail.com",
           password:"windowS90#",
           host:"smtp.gmail.com",
           ssl:true
     });
};
module.exports=middle;