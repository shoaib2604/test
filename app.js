const express=require('express')
const exphbs=require('express-handlebars')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const port=5000||process.env.PORT
const app=express()
mongoose.connect('mongodb://localhost/ideaapp',{
    useNewUrlParser: true
})
.then(()=> console.log('database connceted'))
.catch(err=>console.log(err))

//loading model
require('./models/Idea')
const Idea=mongoose.model('ideas')

//handlebars middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')

//body-parser middleware

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.render('index',{
        title:'MY CRUD APP'
    })

})
app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add')
})
app.get('/ideas/edit/:id',(req,res)=>{

    
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        console.log(idea.title)
        res.render('ideas/edit',{
            idea
        })
    })
    .catch(err=>console.log(err))
    
})
app.post('/ideas',(req,res)=>{
    let errors=[]
    if(!req.body.title){
        errors.push({text:'Please add a title'})
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'})
    }
    if(errors.length>0){
        res.render('ideas/add',{
            errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        const newUser={
            title:req.body.title,
            details:req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea=>{
                res.redirect('/ideas')
            })
    }
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{ideas})
    })
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})