const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true,'cannot be blank'] }, 
    lastName: {type: String, required: [true,'cannot be blank'] },
    email: {type: String, required: [true,'cannot be blank']},
    password: {type: String, required: [true,'cannot be blank'], unique: true},
});


// replace plain text password with hashed password before saving
// pre middleware
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();

    }) 
    .catch(err=>{
        next(err);
    })
})

// compare plain text password with hashed password
userSchema.methods.comparePassword = function(loginPassword){
    return bcrypt.compare(loginPassword, this.password);
}
module.exports = mongoose.model('User', userSchema);