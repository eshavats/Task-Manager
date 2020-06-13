const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
     type: String,
     required: true,
     trim: true
    },
    email : {
     type: String,
     required: true,
     unique: true, //so that an email id can be used only once to create an account
     trim: true, //remove spaces
     lowercase: true,
     validate(value) {
         if(!validator.isEmail(value))
         {
             throw new Error("Email is invalid!");
         }
     }
    },
    age: {
     type: Number,
     default: 0,
     validate(value) {
         if(value < 0)
         {
             throw new Error("Age must be a positive number!");
         }
     }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes("password"))
            {
                throw new Error('Password cannot contain "password"');
            }
        }
    } 
 });

 //To find the user when he logs in
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if(!user)
    {
        throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
    {
        throw new Error("Unable to login!");
    }

    return user;
};

//Hash the plain text password before saving
userSchema.pre("save", async function(next) {
    const user = this;

    if(user.isModified("password"))
    {
        user.password = await bcrypt.hash(user.password, 8)
    } 
    //always call next() at the end of the function so that the function execution ends and doesn't hang
    next(); 
});

const User = mongoose.model("User", userSchema);

module.exports = User;