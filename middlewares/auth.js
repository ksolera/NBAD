const connection = require('../models/connection');
const {validateId} = require('../middlewares/validator');
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }
    else{
        req.flash('error', 'You are already logged in');
        return res.redirect('/users/profile');  
    }
}

exports.isLoggedIn = (req, res, next)=>{
    console.log(req.session,'logged in');
    if(req.session.user){
        return next();
    }
    else{
        req.flash('error', 'You are not logged in');
        return res.redirect('/users/login');
    }
}

// check if user is author of story
exports.isHost = (req, res, next)=>{
    let id = req.params.id;
    connection.findById(id)
    .then(connection=>{

        if(connection){
            if(connection.Host == req.session.user){
                return next();
        }
        else{
            let err = new Error('You are not the author of this story');
            err.status = 401;
            return next(err);
            req.flash('error', 'You are not the author of this story');
            
        }

        }
        else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
};

exports.isNotHost = (req, res, next)=>{
    let id = req.params.id;
    connection.findById(id)
    .then(connection=>{

        if(connection){
            if(connection.Host != req.session.user){
                return next();
        }
        else{
            let err = new Error('You are the Host of this story');
            err.status = 401;
            return next(err);
            req.flash('error', 'You are not the author of this story');
            
        }

        }
        else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
};