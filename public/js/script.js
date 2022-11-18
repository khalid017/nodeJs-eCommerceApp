

let btn = document.getElementById("load")
let parent = document.getElementById("products")
let item = document.getElementById("items")


//fun for skip value, on each button click, skip 5,10... products
f = function(){
    s = 0
    return ()=>{
        s+=5
    }
}()
function id()
{
    let Id = new Date().getTime()
    return Id
}
btn.addEventListener("click",()=>{
    f()
    req = new XMLHttpRequest()
    req.open("GET",`http://localhost:3000/load-more?limit=5&skip=${s}`)
    req.send()

    req.addEventListener("load",()=>{
       let data = JSON.parse(req.responseText)
       data.d.forEach((t)=>
       {
           if(s+5>data.count)
           {
            btn.setAttribute("hidden","hidden")
           }
           populateDom(t.name,t.image,t.description,t._id,t.price)
       })
       
    })
    
})
req = new XMLHttpRequest()
req.open("GET",`http://localhost:3000/load-more?limit=5&skip=0`)
req.send()
req.addEventListener("load",()=>{
    let tasks = JSON.parse(req.responseText)// get req bhjne se array aa jayega containing objects
    console.log(tasks)
    tasks.d.forEach((t)=>
    {
        // console.log(t.description)
        if(s+5>tasks.count)
        {
         btn.setAttribute("hidden","hidden")
        }
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
           html+= "<a href=http://localhost:3000/addToCart/"+id+"><button>"+  "add to cart" +"</button></a>"
       "<div id="+ id+1 +" class="+"box"+">"
         html+="<a class=button href=#"+id+">view details</a>"
       html+="</div>"
       html+="<div class=overlay id="+id+">"
         html+="<div class=popup>"
           html+="<h2>Description</h2>"
           html+="<a class=close href=#"+ id+1 +">&times;</a>"
           html+="<div class=content>"+description+"</div>"
         html+="</div>"
        
        
        
        cont.innerHTML = html
        parent.appendChild(cont)
        // parent.appendChild(cont)  
}
