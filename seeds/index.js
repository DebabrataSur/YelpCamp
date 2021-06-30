const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
  console.log('mongoose connected')
});

// const camp = async() =>{
//     await Campground.findByIdAndDelete({_id:'60b5da921c236b4090f47ca3'});
//     console.log('sucess!!');
// }

// camp();

//  function to accept array and return random element from that array
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    
        for(let i=0; i<300; i++){
            const randomNum = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            const camp = new Campground({
                author: '60cc2e9a8f5fa32ee03d8992',
                images:[
                    {
                      url: 'https://res.cloudinary.com/dxhdlv8ly/image/upload/v1624376313/YelpCamp/wn6dqnxsdq3pynv57elc.jpg',
                      filename: 'YelpCamp/t0rbdauvcakdt0iprvyo'
                    },
                    {
                      url: 'https://res.cloudinary.com/dxhdlv8ly/image/upload/v1624363158/YelpCamp/ifqz7vuqdl1eghxr5acs.jpg',
                      filename: 'YelpCamp/radmaqvfwzvbklszwa2s'
                    }
                ],
                geometry: { 
                  coordinates: [ 
                    cities[randomNum].longitude,
                    cities[randomNum].latitude
                   ],
                  type: 'Point' 
                },
                title: `${sample(places)} ${sample(descriptors)}`,
                description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam nostrum voluptatem tempora veniam, incidunt cum velit hic enim nesciunt sit facere, corrupti ipsam iusto earum inventore doloremque harum vitae explicabo',
                location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
                price
              })
            await camp.save();
        }
}

seedDB().then(() => {
  mongoose.connection.close();
})