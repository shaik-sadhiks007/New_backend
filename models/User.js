const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        // username : {
        //     type : String,
        //     required : true,
        //     trim : true, 
        // },
        email : {
            type : String,
            required : true,
            unique : true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            
        },

        password : {
            type : String,
            required : true,
            minlength : 6,
        }
    }
);

const User = mongoose.model('User',userSchema);

module.exports = User;

