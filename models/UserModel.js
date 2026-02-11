import {Schema, model} from 'mongoose';

const userSchema = new Schema({ 
    firstName:{
        type:String,
        required:[true, "First name is required"]
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:[true, "Duplicate email not allowed"]
    },
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    profileImageUrl:{
        type:String
    },
    role:{
        type:String,
        enum:["AUTHOR","USER","ADMIN"],
        required:[true, "{Value} is an Invalid Role"]
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false
});

//create model
export const UserTypeModel = model("user", userSchema);