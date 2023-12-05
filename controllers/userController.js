// const model = require('../models/user');
// const Connection = require('../models/connection');

// exports.new= (req, res, next)=>{
//   console.log("TTTTTTTTTTtg");
//     return res.render('./user/new');
// };
// exports.index = (req, res, next)=>{
//     res.redirect("/users/new");
// }

// exports.login = (req, res, next)=>{
//   return res.render("./user/login");
// }
// exports.create = (req, res, next)=>{
//     let user = new User(req.body);
//     console.log(user); 
//     user
//       .save()
//       .then(() => res.redirect("/users/login"))
//       .catch((err) => {
//           if(err.name==='ValidationError'){
//               req.flash('error', err.message);
//               return res.redirect('/users/new');
//           }
//           if(err.code === 11000){
//               req.flash('error', 'Email already exists');
//               return res.redirect('/users/new');
//           }
//         next(err);
//       });
// };

// exports.authenticate = (req, res, next)=>{
//   let email = req.body.email;
//   let password = req.body.password;
//   model.findOne({ email: email })
//     .then((user) => {
//       if (user) {
//         user.comparePassword(password).then((result) => {
//           if (result) {
//               req.session.user = user._id;
//               req.flash('success', 'You are now logged in');
//             res.redirect("/users/profile");
//           } else{
//               req.flash('error', 'Wrong password');
//               res.redirect("/users/login");
//               console.log("wrong password");
//           }
//         });
//       } else {
//           req.flash('error', 'Wrong email');
//           console.log("wrong email");
//           res.redirect("/users/login");}
//     })
//     .catch((err) => {
//       next(err);
//     });
// }


// exports.logout = (req, res, next)=>{
//     req.session.destroy(err => {
//         if (err) {
//           return next(err);
//         } else {
//           res.redirect("/");
//         }
//       });
// }



const model = require('../models/user');
const Connection = require('../models/connection');
const rsvpModel = require('../models/RSVP');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    
    let user = new model(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email)
        email = email.toLowerCase();
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({Host: id}), rsvpModel.find({user: id}).populate('connection','Name Topic')])
    .then(results=>{
        const [user, connections,rsvps] = results;
        console.log(rsvps);
        res.render('./user/profile', {user, connections, rsvps});
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



