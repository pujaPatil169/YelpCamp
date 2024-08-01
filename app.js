const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');//this is just one of many engines that are used to run or parse and basically make sense of ejs
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('connected to database');
})

app.engine('ejs',ejsMate);//this is the way of us telling express thats the one we want to use instead of the default one it is relying on 
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// app.get('/campground',async ( req ,res)=>{
//     const camp = new Campground({title:'nalanda',description:'asthetic camping!!'});
//     await camp.save();
//     res.send(camp);
    
//     // res.render('home');
// })
app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/campgrounds',async(req,res)=>{
    const campgrounds =await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
    // res.send('hello')
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})//order really matters here it we put this /new route after /:id then it will treate new as id and not the actual seperate route

app.post('/campgrounds',async(req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
app.get('/campgrounds/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    res.render('campgrounds/edit',{campground})
})
app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);

})
app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
})
app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})
app.listen(3000,()=>{
    console.log('listening/serving on port 3000');
})

//----------notes
//value attribute --value for an input is just an attribute that we use to set the starting value

// app.get('/campgrounds', async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds })
// });
// app.get('/campgrounds/new', (req, res) => {
//     res.render('campgrounds/new');
// })

// app.post('/campgrounds', async (req, res) => {
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`)
// })

// app.get('/campgrounds/:id', async (req, res,) => {
//     const campground = await Campground.findById(req.params.id)
//     res.render('campgrounds/show', { campground });
// });
