let f=false;
var pass=document.querySelectorAll('.password');
pass[1].addEventListener('input',()=>{
     if(pass[0].value==pass[1].value)
       f=true;
     else
       f=false;  
});
function check()
{
    if(f==true)
      return true;
    else
    {
        pass[0].classList.add('pass-error');
        pass[1].classList.add('pass-error');
        return false;
    }  
}