import { UserTypeModel } from "../models/UserModel.js"

export const checkUser = async(req, res, next) => {
    // get user id 
    let uid = req.user.userId;
    //verify user
    let user = await UserTypeModel.findById(uid);
    //if user not found
    if(!user){
        return res.status(401).json({message:"invalid user"})
    }
    //if User found but role is different 
    if(user.role !== "USER"){
        return res.status(403).json({message:"Access denied. Not a USER"})
    }
    //if user is blocked
    if(!user.isActive){
        return res.status(403).json({message:"user is not active"})
    }
    //forward req to next
    next();
}