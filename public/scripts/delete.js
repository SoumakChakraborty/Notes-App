$('.delete').on('click',"a",(e)=>
{
    let http=new XMLHttpRequest();
    http.open("DELETE","http://localhost:3500/delete/"+e.target.name,true);
    http.onreadystatechange=()=>{
        if(http.readyState==4&&http.status==200)
        {
            let res=JSON.parse(http.response);
            if(res.state=="ok")
              window.location.reload();
        }
    }
    http.send();
});