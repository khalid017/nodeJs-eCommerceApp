
let parent = document.getElementById("products")


req = new XMLHttpRequest()
req.open("GET",`http://localhost:3000/allProducts`)
req.send()
req.addEventListener("load",()=>{
    let tasks = JSON.parse(req.responseText)// get req bhjne se array aa jayega containing objects
    console.log(tasks)
    tasks.forEach((t)=>
    {
        // console.log(t.description)
        populateDom(t.name,t.image,t.description,t._id,t.price,t.qty)
    })
 
})

function populateDom(namee,image,description,id,price,qty)
{
    cont = document.createElement("div")
    cont.setAttribute("id","items") 
    html=""
           html+= "<h3> product name :"+ namee +"</h3>"
           html+= "<h5> price :"+"&#8377 "+ price +"</h5>"
           html+= "<img src="+image+">"
           html+= "<h5>"+"qty :"+ qty +"</h5>"
           html+= "<p>"+"description :"+ description +"<p>"
     
        html+= "<a href=http://localhost:3000/updateProds/"+id+"><button>"+  "update" +"</button></a>"
        html+= "<a href=http://localhost:3000/deleteProduct/"+id+"><button>"+  "delete" +"</button></a>"
        
        
        cont.innerHTML = html
        parent.appendChild(cont)


        // parent.appendChild(cont)  
}

