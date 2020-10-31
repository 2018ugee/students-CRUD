const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const _=require("lodash")

const app=express()
app.use((req,res,next) => {
    console.log("Request url:" +req.originalUrl)
    console.log("Request type:" +req.method)

    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate()+"/"+(parseInt(currentdate.getMonth())+1)
    +"/"+currentdate.getFullYear()+" @ "  
    +currentdate.getHours()+":"  
    +currentdate.getMinutes()+":"+currentdate.getSeconds()

    console.log(datetime)

    next()
})

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.set('view engine','ejs')

const students=[
    {
        Name:"Hallie Mercer",
        Id:101,
        Age:21,
        Gender:"Female",
        Address:"932 Franklin Street, Bedias, Minnesota, 1488",
        Company:"ORBALIX",
        Email:"halliemercer@orbalix.com",
        Phone:"+1 (973) 436-3372",
        About: "Incididunt deserunt irure in ipsum sunt ea Lorem eu voluptate ut commodo dolor. Eiusmod ad sit labore veniam labore. Veniam est cupidatat et ut consequat. Nulla nulla et minim in sunt consequat ex labore qui mollit.\r\n",
        Registered:"2016-01-22T09:46:19 -06:-30",
        FavoriteFruit: "banana"
    },
    {
        Name:"Chris Owen",
        Id:102,
        Age:27,
        Gender:"Male",
        Address:"932 Georgia Street, Prasier, Alabama, 1289",
        Company:"ARCHIOB",
        Email:"chrisowen@archiob.com",
        Phone:"+1 (973) 364-9879",
        About: "Incididunt deserunt irure in ipsum sunt ea Lorem eu voluptate ut commodo dolor. Eiusmod ad sit labore veniam labore. Veniam est cupidatat et ut consequat. Nulla nulla et minim in sunt consequat ex labore qui mollit.\r\n",
        Registered:"2016-01-22T09:46:19 -06:-30",
        FavoriteFruit: "apple"
    },
    {
        Name:"Evan Dojo",
        Id:103,
        Age:18,
        Gender:"Male",
        Address:"932 Georgia Street, Prasier, Alabama, 1289",
        Company:"ARCHIOB",
        Email:"chrisowen@archiob.com",
        Phone:"+1 (973) 364-9879",
        About: "Incididunt deserunt irure in ipsum sunt ea Lorem eu voluptate ut commodo dolor. Eiusmod ad sit labore veniam labore. Veniam est cupidatat et ut consequat. Nulla nulla et minim in sunt consequat ex labore qui mollit.\r\n",
        Registered:"2016-01-22T09:46:19 -06:-30",
        FavoriteFruit: "apple"
    },
    {
        Name:"Jack Dawson",
        Id:104,
        Age:35,
        Gender:"Male",
        Address:"932 Georgia Street, Prasier, Alabama, 1289",
        Company:"ARCHIOB",
        Email:"chrisowen@archiob.com",
        Phone:"+1 (973) 364-9879",
        About: "Incididunt deserunt irure in ipsum sunt ea Lorem eu voluptate ut commodo dolor. Eiusmod ad sit labore veniam labore. Veniam est cupidatat et ut consequat. Nulla nulla et minim in sunt consequat ex labore qui mollit.\r\n",
        Registered:"2016-01-22T09:46:19 -06:-30",
        FavoriteFruit: "apple"
    },
    {
        Name:"Harry Patts",
        Id:105,
        Age:42,
        Gender:"Male",
        Address:"932 Incididunt deserunt, sunt ea, 1876",
        Company:"ARCHIOB",
        Email:"harrypatts@archiob.com",
        Phone:"+1 (973) 364-9879",
        About: "Incididunt deserunt irure in ipsum sunt ea Lorem eu voluptate ut commodo dolor. Eiusmod ad sit labore veniam labore. Veniam est cupidatat et ut consequat. Nulla nulla et minim in sunt consequat ex labore qui mollit.\r\n",
        Registered:"2016-01-22T09:46:19 -06:-30",
        FavoriteFruit: "apple"
    },
]
const admin={
    username:"studentadmin",
    password:12345,
}

app.get("/",function(req,res){

   
    res.render('home',{students:students,isAdmin:false});

});

app.get('/admin',function(req,res){
    res.render('adminLoginPage')
})

app.post('/adminLogin',function(req,res){
    let username=req.body.username,password=req.body.password
    if(username===admin.username&&password==admin.password){
        res.render('home',{students:students,isAdmin:true})
    }else{
        res.send('Oops! wrong username or password')
    }
})

app.post("/detailPage",function(req,res){
    let Id=req.body.Id
    let mystudent=null
    // console.log(Id)
    students.forEach(student => {
        if(student.Id==Id){
            mystudent=student
            // console.log(student.Name)
        }
    })
    // console.log(mystudent);
    if(mystudent!=null){
        res.render('studentDetail',{student:mystudent,error:null})
    }
    else{
        res.render('studentDetail',{student:null,error:"error"})
    }
});

app.post("/addStudent",function(req,res){
    let newStudent={
        Name:req.body.Name,
        Id:req.body.Id,
        Age:req.body.Age,
        Gender:req.body.Gender,
        Address:req.body.Address,
        Company:req.body.Company,
        Email:req.body.Email,
        Phone:req.body.Phone,
        About:req.body.About,
        Registered:req.body.Registered,
        FavoriteFruit:req.body.FavoriteFruit
    }
    students.push(newStudent)
    res.render('home',{students:students,isAdmin:true})
})

app.post("/updateDetailsPage",function(req,res){
    let Id=req.body.Id
    let mystudent=null
    students.forEach(student => {
        if(student.Id==Id){
            mystudent=student
        }
    })
    if(mystudent)
    res.render('updatePage',{student:mystudent,Id:Id,error:null})
    else{
        res.render('updatePage',{student:mystudent,Id:Id,error:"error"})
    }
})

app.post('/updateDatabase',function(req,res){
    // console.log(req.body);
    let mystudent,index=0
    for(;index<students.length;index++){
        if(students[index].Id==req.body.studentId){
            break
        }
    }

    for(var key in req.body){
        if(req.body[key]=='')
        continue;
        students[index][key]=req.body[key]
    }

    res.render('studentDetail',{student:students[index],error:null})
})


app.post('/delete',function(req,res){
    let Id=req.body.Id,myindex=-1
    students.forEach((student,index) => {
        if(student.Id==Id){
            myindex=index
        }
    })
    if(myindex>=0){
        students.splice(myindex,1)
        res.render('home',{students:students,isAdmin:true})
    }else{
        res.render('deleteError')
    }
})



app.listen(3000,function(){
  console.log("server started");
})
