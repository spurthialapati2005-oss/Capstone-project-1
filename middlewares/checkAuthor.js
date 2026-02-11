import { UserTypeModel } from "../models/UserModel.js"

export const checkAuthor = async(req, res, next) => {
    //get author id
    let aId = req.user.userId
    //verify author
    let author = await UserTypeModel.findById(aId);
    //if author not found
    if(!author){
        return res.status(401).json({message:"invalid Author"})
    }
    //if author found but role is different 
    if(author.role !== "AUTHOR"){
        return res.status(403).json({message:"user is not an Author"})
    }
    //if author is blocked
    if(!author.isActive){
        return res.status(403).json({message:"Author is not active"})
    }
    //forward req to next
    next();
}