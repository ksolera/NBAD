const {body, validationResult} = require('express-validator');
exports.validateId = ( req, res, next ) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    else{
        return next();
    }
}
exports.validateSignup = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email address must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 long').isLength({min: 8, max: 64})
]

exports.validateLogin = [
    body('email', 'Email address must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 long').isLength({min: 8, max: 64})
]

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }
    return next();
}

const { isDate, isAfter, matches } = require('validator');

exports.validateConnection = [
    body('Name', 'Name cannot be empty').notEmpty().trim().escape(),
    body('Details', 'Details must be at least 10 characters').isLength({ min: 10 }).trim().escape(),
    body('Location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('Date', 'Invalid date format').custom((value, { req }) => {
            const currentDate = new Date();
            if (!isAfter(value, currentDate.toString())) {
                throw new Error('Date must be after today');
            }
            return true;
        }),
    body('Start', 'Start time cannot be empty').notEmpty().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format').trim().escape(),
    body('End', 'End time cannot be empty').notEmpty().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format').trim().escape(),
    body()
        .custom((value, { req }) => {
            const start = req.body.Start;
            const end = req.body.End;

            // Check if end time is after start time
            if (start && end && start >= end) {
                throw new Error('End time must be after start time');
            }

            return true;
        })
];


exports.validateRSVP = [
    body('rsvp', 'rsvp cannot be empty. It should be either YES | NO | MAYBE').notEmpty().trim().escape().toLowerCase().isIn(['yes', 'no', 'maybe'])
]