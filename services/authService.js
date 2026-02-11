import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserTypeModel } from "../models/UserModel.js";

//register function
export const register = async (userObj) => {
    //Create doc
    const userDoc = new UserTypeModel(userObj);
    //validate for empty pswds
    await userDoc.validate();
    //hash and replace plain pswd
    userDoc.password = await bcrypt.hash(userDoc.password, 10);
    //save
    const created = await userDoc.save();
    //convert doc to obj to remove pswd
    const newUserObj = created.toObject();
    //remove pswd
    delete newUserObj.password;
    //return user obj w/o pswd
    return newUserObj;
}

//authenticate function
export const authenticate = async ({ email, password }) => {
    //check user w email and role
    const user = await UserTypeModel.findOne({ email });
    if(!user){
        err.status = 401;
        throw err;
    }
    //if user

    //compare pswds
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const err = new Error("Invalid password");
        err.status = 401;
        throw err;
    }

    //check isActive state
    if(user.isActive === false){
        const err = new Error("Your account is blocked. Contact admin");
        err.status = 403;
        throw err;
    }
    
    //generate token
    const token = jwt.sign({ userId: user._id,
        role: user.role, email: user.email },
        process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user:userObj }
}