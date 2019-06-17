let flag=false;
let others=false;
$('#user-options a').on("click",()=>{
    if(!flag)
    {
        $('.formdiv').append('<i class="fas fa-times" id="close"></i>');
        $('.formdiv').append('<form action="/signin" method="POST"></form>');
        $('.formdiv form').append('<input type="email" name ="username" id="username" placeholder="Username" required><br>');
        $('.formdiv form').append('<input type="password" name="password" class="password" placeholder="Password" required><br>');
        $('.formdiv form').append('<input type="submit" value="Sign In" id="submit">')
        $(".formdiv").append('<div id="user-act"></div>');
        $('.formdiv #user-act').append('<div id="signup"><a href="#" id="signupanc">Sign Up</a></div>');
        $('.formdiv #user-act').append('<div id="forgot"><a href="#" id="forgotanc">Forgot Password?</a></div>');
        $('.formdiv').slideDown();
        flag=true;
        others=false;
    }
    else
    {
       $('.formdiv #close').remove();
       $('.formdiv form').remove();
       $('.formdiv #user-act').remove();
       $('.formdiv').slideUp();
       flag=false;
       others=false;
    }
});
$('.formdiv').on('click',"#close",()=>
{
    if(others==true)
    {
        $('.formdiv').removeClass('formdiv-signup');
        $('.formdiv #close').remove();
        $('.formdiv form').remove();
        $('body #check').remove();
        $('.formdiv').slideUp();
        flag=false;
    }
   else
   { 
       $('.formdiv #close').remove();
       $('.formdiv form').remove();
       $('.formdiv #user-act').remove();
       $('.formdiv').slideUp();
       flag=false;
   }
});
$('.formdiv').on("click","#user-act",function(e)
{
      if(e.target.id=="signupanc")
      {
        $('.formdiv #close').remove();
        $('.formdiv form').remove();
        $('.formdiv #user-act').remove();    
        $('.formdiv').addClass('formdiv-signup');  
        $('.formdiv').append('<i class="fas fa-times" id="close"></i>');
        $('.formdiv').append('<form action="/signup" method="POST" onsubmit="return check()"></form>');
        $('.formdiv form').append('<input type="text" id="fname" name="fname" placeholder="First Name" required><br>');
        $('.formdiv form').append('<input type="text" id="lname" name="lname" placeholder="Last Name" required><br>');
        $('.formdiv form').append('<input type="email" id="username" name="username" placeholder="Username" required><br>');
        $('.formdiv form').append('<input type="password" class="password" name="password" placeholder="Password" required><br>');
        $('.formdiv form').append('<input type="password" class="password" placeholder="Retype Password" required><br>');
        $('.formdiv form').append('<input type="submit" value="Sign Up" id="submit">');
        $('body').append('<script src="/scripts/check.js" id="check"></script>');
        $('.formdiv').slideDown();
        flag=true;
        others=true;
      }
      else
      {
        $('.formdiv #close').remove();
       $('.formdiv form').remove();
       $('.formdiv #user-act').remove();  
        $('.formdiv').append('<i class="fas fa-times" id="close"></i>');
        $('.formdiv').append('<form action="/resetpass" method="POST"></form>');
        $('.formdiv form').append('<input type="email" name="email" id="username" placeholder="Enter email" required><br>');
        $('.formdiv form').append('<input type="submit" value="Reset Password" id="submit">')
        $('.formdiv').slideDown();
        flag=true;
        others=true;
      }
});