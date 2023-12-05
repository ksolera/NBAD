const model= require('../models/connection');
const rsvpModel = require('../models/RSVP');

// Get all stories and send them to the user
exports.index = (req, res,next)=>{
    // let categories = model.loop();
    
    // console.log(categories);
    model.find()
    .then((connections) => {
        // Use the distinct method on the model
        model.distinct('Topic').exec()
            .then((categories) => {
                categories = categories.sort();
                res.render('./connection/connections', { connections, categories });
            })
            .catch((err) => {
                console.log(err.message);
                next(err);
            });
    })
    .catch(err=>console.log(err.message) || next(err));
};


exports.show = (req, res, next)=>{

    let id = req.params.id;
    let user = req.session.user;
    Promise.all([
        model.findById(id).populate('Host', 'firstName lastName'),
        rsvpModel.count({connection:id,rsvp:"yes"})

    ])
    .then(results=>{
        const [connection, rsvps] = results;
        console.log("rsvps",connection);
        if(connection) {
            return res.render('./connection/show', {connection,user,rsvps});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err)); 
};

    
exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(connection=>{
        if(connection) {
            return res.render('./connection/edit', {connection});
        } else {
            let err = new Error('connection not found with id:' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};


exports.update = (req, res, next)=>{
    let id = req.params.id;
    let connection = req.body;
    console.log(connection);
    model.findByIdAndUpdate(id, connection,{useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection){
        return res.redirect('/connections/'+id);
    }
    else {
        let err = new Error('Cannot find a connection with id ' + id);
        err.status = 404;
        next(err);
    }
})
    .catch(err=>{
        if (err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)});
};


exports.new = (req, res)=>{
    res.render('./connection/new');
};


exports.create = (req, res,next)=>{
    //res.send('Created a new story');
    let connection = new model(req.body); //req.body;
    connection.Host = req.session.user;
    connection.save()
    .then((connection)=>res.redirect('/connections'))
    .catch(err=>
        {
            if (err.name === 'ValidationError'){
                err.status = 400;
            }
        next(err);
    }); 
};

exports.delete = (req, res, next)=>{
    
    let user = req.session.user;
    if(user){
        let id = req.params.id;
        Promise.all([model.findByIdAndDelete(id,{useFindAndModify: false}),rsvpModel.deleteMany({connection:id})])
        .then(connection=>{
            req.flash('success', 'Deleted a connection and all rsvps');
            res.redirect('/connections');
            })
        .catch(err=>{
            console.log(err);
            if(err.name === 'ValidationError'){
                req.flash('error', err.message);
                return res.redirect('/back');
            }
            next(err);
        });
    };
}

exports.editrsvp = (req, res, next)=>{
    console.log(req.body.rsvp);
    let id = req.params.id;
    rsvpModel.findOne({ connection: id, user: req.session.user }).then(rsvp=>{
        if(rsvp){
            //update
            rsvpModel.findByIdAndUpdate(rsvp._id,{rsvp:req.body.rsvp},{useFindAndModify: false, runValidators: true}).then(rsvp=>{
                req.flash('success', 'Updated RSVP');
                res.redirect('/users/profile/');
            })
            .catch(err=>{
                console.log(err);
                if (err.name === 'ValidationError'){
                    req.flash('error', err.message);
                    return res.redirect('/back');
                }
                next(err);
            })
        }
        else {
            //create
            let Rsvp = new rsvpModel({
                rsvp: req.body.rsvp,
                connection: id,
                user : req.session.user
            });
            Rsvp.save()
            .then(rsvp=>{
                req.flash('success', 'Created RSVP');
                res.redirect('/users/profile/');
            })
            .catch(err=>{
                req.flash('error', err.message);
                next(err);
            })

        }
    })
}

exports.deletersvp = (req, res, next)=>{
    let id = req.params.id;
    rsvpModel.findOneAndDelete({ connection: id, user: req.session.user })
    .then(rsvp=>{
        req.flash('success', 'Deleted RSVP');
        res.redirect('/users/profile/');
        
    })
    .catch(err=>{
        console.log(err);
        if (err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    })
}