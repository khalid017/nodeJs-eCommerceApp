
let parent = document.getElementById("cart")



req = new XMLHttpRequest()
req.open("GET",`http://localhost:3000/sendCart`)
req.send()
req.addEventListener("load",()=>{
    let tasks = JSON.parse(req.responseText)// get req bhjne se array aa jayega containing objects
    console.log(tasks)
    tasks.forEach((t)=>
    {
        tot+=t.price
        // console.log(t.description)
        populateDom(t.name,t.image,t.description,t._id,t.price)
    })
 
})

function populateDom(namee,image,description,id,price)
{
    cont = document.createElement("div")
    cont.setAttribute("id","items") 
    html=""
           html+= "<h3>"+ namee +"</h3>"
           html+= "<h5>"+"&#8377 "+ price +"</h5>"
           html+= "<img src="+image+">"
        //    html+= "<a href=http://localhost:3000/addToCart/"+id+"><button>"+  "add to cart" +"</button></a>"
       "<div id="+ id+1 +" class="+"box"+">"
         html+="<a class=button href=#"+id+">view details</a>"
       html+="</div>"
       html+= "<a href=http://localhost:3000/deleteCart/"+id+"><button>"+  "delete" +"</button></a>"
       html+="<div class=overlay id="+id+">"
         html+="<div class=popup>"
           html+="<h2>Description</h2>"
           html+="<a class=close href=#"+ id+1 +">&times;</a>"
           html+="<div class=content>"+description+"</div>"
         html+="</div>"
        
         cont.innerHTML = html
         parent.appendChild(cont)
         total.innerHTML = "<h4> Cart total : "+"&#8377 "+ tot +"</h4>"
 
        
        
        cont.innerHTML = html
        parent.appendChild(cont)


        // parent.appendChild(cont)  
}

