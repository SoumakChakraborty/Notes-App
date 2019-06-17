const express=require("express");
const app=express();
const middle=require("./modules/middleware");
const body=require("body-parser");
const flash=require("connect-flash");
let session=require("express-session");
let search=require("./modules/search");
let rep=require("./modules/replace");
let method=require("method-override");
let map=new Map();
app.use(method("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(body.urlencoded({extended:true}));
app.use(flash());
app.use(session({
         secret:"This is secret to me and myself only",
         resave:false,
         saveUninitialized:false,
         cookie:{maxAge:94608000000,signed:true}               
}));
app.get("/",(req,res)=>{
    let state=middle.isLoggedIn(req);
    if(state==false)  
      res.render("landing",{msg:req.flash("msg")});
    else
      res.redirect("/notes");  
});
app.post("/signup",(req,res)=>
{
    let fname=req.body.fname;
    let lname=req.body.lname;
    let username=req.body.username;
    let password=req.body.password;
    let conn=middle.connection();
    conn.query("select * from user where username='"+username+"'",(error,result,field)=>{
        if(result.length!=0)
        {
            req.flash("msg","User exists");
            res.redirect("/");
        }
        else
        {
             let enc=middle.encrypt(password);
             conn.query("insert into user values('"+fname+"','"+lname+"','"+username+"','"+enc+"')",(err,results,fields)=>
             {
                 if(err)
                   console.log(err);
                 else
                   res.redirect("/");  
             });       
        }  
    });
});
app.post("/signin",(req,res)=>
{    
    let username=req.body.username;
    let password=req.body.password;
    let conn=middle.connection();
    conn.query("select * from user where username='"+username+"'",(error,results,fields)=>
    {
        if(results.length==0)
        {
            req.flash("msg","Username does not exist");
            res.redirect("/");
        }
        else
        {
            let enc=middle.encrypt(password);
            if(enc!=results[0].password)
            {
                req.flash("msg","Password does not match");
                res.redirect("/");
            }
            else
            {
                req.session.uname=username;
                res.redirect("/notes");
            }   
        }
    });
});
app.get("/signout",(req,res)=>
{
    let state=middle.isLoggedIn(req);
    if(state==false)
       res.redirect("/");
    else
    {
      req.session.destroy((err)=>{
           if(!err)
             res.redirect("/");
      });
    }  
});
app.get("/notes",(req,res)=>
{
     let state=middle.isLoggedIn(req);
     if(state===false)
       res.redirect("/");
     else
     {
        let conn=middle.connection();
        conn.query("select * from note where username='"+req.session.uname+"'",(err,result,field)=>
        {
            res.render("notepage",{notes:result,user:req.session.uname}); 
        });
     }
});
app.post("/create",(req,res)=>
{
   let state=middle.isLoggedIn(req);
   if(state==false)
     res.redirect("/");
   else
   {
     let conn=middle.connection();
     let note_name=req.body.notename;
     let note_body=req.body.notebody;
     let d=new Date();
     let created=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
     conn.query("insert into note(username,note_name,note_text,created) values('"+req.session.uname+"','"+note_name+"','"+note_body+"','"+created+"')",(err,result,field)=>
     {
          if(err)
            console.log(err);
          else
            res.redirect("/notes");                
     });
   }      
});
app.get("/view/:id",(req,res)=>
{
    let state=middle.isLoggedIn(req);
    if(state==false)
      res.redirect("/");
    else
    {
      let conn=middle.connection();
      conn.query("select * from note where noteID='"+req.params.id+"'",(err,result,field)=>
      {
          if(err)
            console.log(err);
          else
            res.render("viewpage",{note:result,msg:req.flash("msg")});  
      });
    }  
});
app.delete("/delete/:id",(req,res)=>
{
    let state=middle.isLoggedIn(req);
    if(state==false)
      res.redirect("/");
    else
    {
      let conn=middle.connection();
      conn.query("delete from note where username='"+req.session.uname+"' and noteID='"+req.params.id+"'",(err,result,field)=>
      {
         if(err)
         {
             console.log(err);
             res.json({state:"error"});
         }
         else
           res.json({state:"ok"});       
      });
    }  
});
app.get("/edit/:id",(req,res)=>
{
   let state=middle.isLoggedIn(req);
   if(state==false)
     res.redirect("/");
   else
   {
     let conn=middle.connection();
     conn.query("select * from note where username='"+req.session.uname+"' and noteID='"+req.params.id+"'",(err,result,fields)=>
     {
          if(err)
            console.log(err);
          else
           res.render("editpage",{note:result});
     });
   }  
});
app.put("/edit/:id",(req,res)=>
{
  let state=middle.isLoggedIn(req);
  if(state==false)
    res.redirect("/");
  else
  {
    let conn=middle.connection();
    let notename=req.body.notename;
    let notebody=req.body.notebody;
    conn.query("update note set note_name='"+notename+"' where username='"+req.session.uname+"' and noteID='"+req.params.id+"'",(err,result,fields)=>
    {
         if(err)
           console.log(err);
    });
    conn.query("update note set note_text='"+notebody+"' where username='"+req.session.uname+"' and noteID='"+req.params.id+"'",(err,result,fields)=>
    {
         if(err)
           console.log(err);
    });
    res.redirect("/notes"); 
  }
});
app.post("/search/:id",(req,res)=>
{
   let state=middle.isLoggedIn(req);
   if(state==false)
     res.redirect("/");
   else
   {
     let conn=middle.connection();
     let word=req.body.word;
     let repl=req.body.replace;
     conn.query("select * from note where username='"+req.session.uname+"' and noteID='"+req.params.id+"'",(err,result,fields)=>
     {
       let string=result[0].note_text;
       let P=search(string,word); 
        if(P.length==0)
        {
            req.flash("msg","Word not found.Try again!!");
            res.redirect("back");
        }
        else
        {
           for(let i=0;i<P.length;i++)
           {
              let index=P[i].split(" ");
              string=rep(string,repl,parseInt(index[0]),parseInt(index[1]));
           }  
           conn.query("update note set note_text='"+string+"' where username='"+req.session.uname+"' and noteID='"+req.params.id+"'",(err,result,fields)=>
           {
              if(err)
               console.log(err);
              else
                res.redirect("back"); 
          }); 
        }
     });
   }  
});
app.get("/changepass/:user",(req,res)=>
{
    let state=middle.isLoggedIn(req);
      if(state==true||(state==false&&map.has("route")==true))
      {
           map.delete("route");
           res.render("changepass",{user:req.params.user});
      }
      else
        res.redirect("/");   
});
app.put("/changepass/:user",(req,res)=>
{
  let state=middle.isLoggedIn(req);
  if(state==false)
    res.redirect("/");
  else
  {
      let conn=middle.connection();
      let password=req.body.password;
      let enc=middle.encrypt(password);
      conn.query("update user set password='"+enc+"' where username='"+req.params.user+"'",(err,result,fields)=>
      {
             if(err)
               console.log(err);
             else
               res.redirect("/");  
      });
  }
});
app.post("/resetpass",(req,res)=>
{
     let email=req.body.email; 
     let server=middle.emailconnection();
     map.set("route","/");
      server.send(
      {
         to:email,
         from:"yelpcamp500@gmail.com",
         text:"Please click on the link: http://localhost:3500/changepass/"+email+"\n to reset your password.\n\nYours faithfully,\nNote Team"
      },(err,msg)=>
      {
          console.log(err||msg);
      });
   res.redirect("/");   
});
app.listen(3500,"127.0.0.1",()=>{
   console.log("Server started");
});