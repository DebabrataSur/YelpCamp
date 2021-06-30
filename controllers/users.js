const User = require('../models/user');

module.exports.renderRegister = (req,res) =>{
    res.render('user/register');
}

module.exports.register = async (req,res,next) =>{
    try{
        const { username, password, email } = req.body;
        const user = new User({username, email});
        const regUser = await User.register( user, password);
        req.login(regUser, err =>{
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp-Camp!');
            res.redirect('/campgrounds');
        })
    }catch(err){
        req.flash('error', err.message);
        res.redirect('/register');
    }
   
}

module.exports.renderLogin = (req,res) =>{
    res.render('user/login');
}

module.exports.login =  (req,res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res) =>{
    req.logout();
    req.flash('success', 'Goodbye :)');
    res.redirect('/campgrounds');
}