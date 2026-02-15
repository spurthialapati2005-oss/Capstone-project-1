import exp from "express"
import { checkUser } from "../middlewares/checkUser.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { UserTypeModel } from "../models/UserModel.js";
import { Article } from '../models/ArticleModel.js';
export const adminRoute = exp.Router()

//Read all articles
adminRoute.get('/articles/:userId', verifyToken, checkUser, async(req, res) => {
    let uid = req.params.userId;
    let articles = await Article.find({ isArticleActive: true })
    res.status(200).json({message:"articles",payload:articles})
})

//block users
adminRoute.get('/block-users/:userId', verifyToken, async(req, res) => {
    let uid = req.params.userId;
    let user = await UserTypeModel.findById(uid)
    if(user.isActive === true){
    if(user.role == "AUTHOR" || user.role == "USER"){
        let blockUser = await UserTypeModel.findByIdAndUpdate(uid,{isActive:false})
        //save
        await blockUser.save()
        res.status(200).json({message:"User blocked, Contact Admin!"})
    }
    }
    else{
        return res.status(400).json({message:"Invalid userId or already blocked"})
    }
})
//unblock user 
adminRoute.get('/unblock-users/:userId', verifyToken, async(req, res) => {
    let uid = req.params.userId;
    let user = await UserTypeModel.findById(uid)
    if(user.isActive === false){
    if(user.role == "AUTHOR" || user.role == "USER"){
        let blockUser = await UserTypeModel.findByIdAndUpdate(uid,{isActive:true})
        //save
        await blockUser.save()
        return res.status(200).json({message:"User unblocked!"})
    }
    }
    else{
        return res.status(400).json({message:"User already unblocked"})
    }
})
