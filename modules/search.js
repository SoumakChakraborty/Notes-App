function KMP(text,pattern)
{
    let Pos=[];
    let Pref=prefix(pattern);
    let k=-1;
    for(let i=0;i<text.length;i++)
    {
        while(k>-1&&pattern.charAt(k+1)!=text.charAt(i))
          k=Pref[k];
        if(pattern.charAt(k+1)==text.charAt(i))
           k++;
        if(k==pattern.length-1)
        {
            Pos.push(`${i-k} ${i}`);
            k=Pref[k];
        }     
    }
   return Pos;
}
function prefix(pattern)
{
    let k=-1;
    let Pref=[];
    Pref[0]=0;
    for(let i=1;i<pattern.length;i++)
    {
        while(k>-1&&pattern.charAt(k+1)!=pattern.charAt(i))
         k=Pref[k];
        if(pattern.charAt(k+1)==pattern.charAt(i))
          k++;
        Pref[i]=k;
    }
  return Pref;  
}
function search(text,pattern)
{
    let P=KMP(text,pattern);
    return P;
}
module.exports=search;