import exp from "express"
import { authenticate } from "../services/authService.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { UserTypeModel } from "../models/UserModel.js";
import { compare,hash } from 'bcryptjs';
export const commonRoute = exp.Router()

//login
commonRoute.post("/authenticate", async(req, res) =>{
     //get user cred Obj
    let userCred = req.body;
    //call authenticate service
    let {token, user} = await authenticate(userCred);
    //save token as httpOnly cookie
    res.cookie("token", token, {
        httpOnly: true ,
        sameSite: "lax",
        secure: false,
    });
    res.status(200).json({message:"login success", payload: user})
})

//logout 
//logout for User, Author and Admin
commonRoute.get('/logout', async(req,res) => {
    //Clear the cookie named token
    res.clearCookie('token',{
        httpOnly: true,  //must match original settings (all three)
        secure: false,
        sameSite: 'lax'
    });
    res.status(200).json({message: "logged out successfully"});
});

//Change password(Protected route)
commonRoute.put('/change-password/:userId',verifyToken, async(req, res) => {
    //get user id from req
    let userId=req.params.userId;
    let userDoc=await UserTypeModel.findById(userId);
    if(!userDoc){
        return res.status(401).json({message:"Invalid User"});
    }
    //get the current password and new password
    let {currentPassword,newPassword}=req.body;
    //check the current password is correct or not
    let checkPassword=await compare(currentPassword,userDoc.password);
    if(!checkPassword){
        return res.status(400).json({message:"Password not matched "});
    }
    //replace current password with new password
    //hash new password
    let hashedPassword=await hash(newPassword,12)
    let updated=await UserTypeModel.findByIdAndUpdate(userId,{$set:{password:hashedPassword}})
    //send res
    return res.status(200).json({message:"Password changed successfully"});
})