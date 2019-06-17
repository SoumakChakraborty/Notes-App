function replace(str1,str2,s,e)
{
    let str="";
    if(((e-s)+1)>=str2.length)
    {
        for(let i=0;i<s;i++)
              str=str+str1.charAt(i);
        for(let i=0;i<str2.length;i++)
          str=str+str2.charAt(i);
        let diff=((e-s)+1)-str2.length;
        for(let i=0;i<diff;i++)
              str=str+" ";
       str=str+str1.substring(e+1,str1.length);    
    }
    else
    {
        for(let i=0;i<s;i++)
            str=str+str1.charAt(i);
        for(let i=0;i<str2.length;i++)
             str=str+str2.charAt(i);
        str=str+str1.substring(e+1,str1.length); 
    }
   return str; 
}
module.exports=replace;