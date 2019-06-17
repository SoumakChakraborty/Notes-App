let stack=[];
let t=-1;
$('#create-note a').on('click',()=>
{
        $('#note-div').append('<i class="fas fa-times" id="close"></i>');
        $('#note-div').append('<form action="/create" method="POST"></form>');
        $('#note-div form').append('<input type="text" name ="notename" id="notename" placeholder="Name of the note" required><br>');
        $('#note-div form').append('<textarea id="notebody" name="notebody" placeholder="Enter text"></textarea><br>');
        $('#note-div form').append('<input type="submit" value="Create" id="submit"><br>');
        $('#note-div form').append('<div id="undo-div"><a href="#" id="undoanc">Undo</a></div>');
        $('#note-div').slideDown();
         
});
$('#note-div').on("click",'#close',()=>
{
   $('#note-div #close').remove();
   $('#note-div form').remove();
   $('#note-div').slideUp();
});
$('#note-div').on("input","form","#notebody",()=>
{
     stack.push($('#note-div form #notebody').val());
     ++t;  
});
$('#note-div').on("click","form",(e)=>
{   
   if(e.target.id=="#undoanc")
   {  
    if(stack.length==0)
      $('#note-div form #notebody').val("");
    else
    {
        stack.pop();     
       --t;
       if(stack.length==0)
          $('#note-div form #notebody').val("");
       else     
         $('#note-div form #notebody').val(stack[t]+"");
    }
   } 
});