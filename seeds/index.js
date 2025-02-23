const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('connected to database');
})


const sample = array=>array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
    const random1000=Math.floor(Math.random()*1000);
    const camp = new Campground({
        title:`${sample(places)} ${sample(descriptors)}`,
        location:`${cities[random1000].city},${cities[random1000].state}`
    })
    await camp.save()

}
}




seedDB();