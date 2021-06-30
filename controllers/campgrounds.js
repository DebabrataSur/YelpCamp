const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken : mapBoxToken })  

module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req,res) =>{   
    res.render('campgrounds/new');
}

module.exports.createCampgrounds = async (req,res,next) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // if(!req.body.campground)    throw new ExpressError('Post errrrrorr', 500);
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully Created!!');
    res.redirect(`/campgrounds/${camp._id}`);      
}

module.exports.showCampgrounds = async (req,res) =>{
    const camp = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(camp);
    if(!camp){
        req.flash('error', 'Sorry cant find the campground!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}

module.exports.renderEditForm = async (req,res) =>{
    const camp = await Campground.findById(req.params.id);
    if(!camp){
        req.flash('error', 'Sorry cant find the campground!!')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
}

module.exports.updateCampgrounds = async (req,res) =>{
    const { id } = req.params;
    // console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs =  req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Edited :)')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampgrounds = async (req,res) =>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted :)')
    res.redirect(`/campgrounds`);    
}