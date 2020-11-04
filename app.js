const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const helmet=require('helmet')
const {createLogger,transports,format, info}=require('winston')
const cors=require('cors')

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.set('view engine','ejs')
app.use(helmet())
app.use(cors())
////To allow cors to specific site - app.use(cors({origin:'https://myapp.com'}))

const logger=createLogger({
    transports:[
        new transports.File({
            filename:'info.log',
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        })
    ]
})

app.use((req,res,next)=>{
    logger.info(req.body)
    logger.info(res.send)
    next()
})


const students=[
    {
        Name:"Hallie Mercer",
        Id:101,
        Age:21,
        Gender:"Female",
        Address:"932 Franklin Street, Bedias, Minnesota, 1488",
        Company:"ORBALIX",
        Email:"halliemercer@orbalix.com",
        Phone:"+19734363372",
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
        Phone:"+119734363372",
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
        Phone:"+119734363372",
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
        Phone:"+119734363372",
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
        Phone:"+119734363372",
        About: "Incididunt deserunt irure in ipsum sunt ea Lorem eu voluptate ut commodo dolor. Eiusmod ad sit labore veniam labore. Veniam est cupidatat et ut consequat. Nulla nulla et minim in sunt consequat ex labore qui mollit.\r\n",
        Registered:"2016-01-22T09:46:19 -06:-30",
        FavoriteFruit: "apple"
    },
]

app.get("/",function(req,res){

    res.json(students);

})


/////////////////////////////////////READ/////////////////////////////////////////////
app.get('/student/:ID',function(req,res){
    students.forEach(student=>{
        if(student.Id==req.params.ID){
            res.json(student)
        }
    })
    res.statusCode=404
    res.send('ID NOT FOUND!')
})


////////////////////////////////////CREATE/////////////////////////////////////////////
app.get('/add',function(req,res){
    res.render('addPage')
})

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
    let flag=0
    students.forEach(student=>{
        if(student.Id==req.body.Id)
        flag=1
    })
    if(flag==0){
        students.push(newStudent)
        res.redirect('/')
    }else{
        res.statusCode=404
        res.send('ID ALREADY EXIST!')
    }
})



////////////////////////////////////UPDATE/////////////////////////////////////////////
app.get('/update/:ID',function(req,res){
    let index=students.indexOf(students.find(student=>{
        return student.Id==req.params.ID;
    }))

    if(index!=-1){
        res.render('updatePage',{student:students[index]})
    }else{
        res.statusCode=404
        res.send('ID NOT FOUND!')
    }
})

app.post('/updateDatabase',function(req,res){
    // console.log(req.body);
    let index=students.indexOf(students.find(student=>{
        return student.Id==req.body.studentId;
    }))

    for(var key in students[index]){
        if(key=='Id')continue;
        students[index][key]=req.body[key]
    }
    res.redirect('/')
})



////////////////////////////////////DELETE/////////////////////////////////////////////
app.get('/delete/:ID',function(req,res){
    let index=students.indexOf(students.find(student=>{
        return student.Id==req.params.ID;
    }))
    
    if(index!=-1){
        students.splice(index,1);
        res.redirect('/');
    }else{
        res.statusCode=404
        res.send('ID NOT FOUND!')
    }
    
})



app.listen(3000,function(){
  console.log("server started");
})
