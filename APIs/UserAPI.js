import exp from 'express';
import { authenticate, register } from '../services/authService.js'
import { Article } from '../models/ArticleModel.js';
import { UserTypeModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js"
import { checkUser } from "../middlewares/checkUser.js"

export const userRoute = exp.Router()

//register user
userRoute.post('/users', async(req, res) => {
    //get user objfrom req
    let userObj = req.body;
    //call register
    const newUserObj = await register({ ...userObj, role:"USER" })
    //send res
    res.status(201).json({message:"user created", payload: newUserObj})
});

//Read all articles
userRoute.get('/users', verifyToken, checkUser, async(req, res) => {
    let uid = req.user.userId;
    let articles = await Article.find({ isArticleActive: true })
     if(!articles){
        return res.status(401).json({message:"Article Not Found"});
    }
    res.status(200).json({message:"All articles", payload: articles})
})

//Add comments to an article
userRoute.post("/comments", verifyToken, checkUser, async(req, res) => {
    //get user id to identify the which user is making a request
    //req.user has decoded token object with properties userId and role
    let userId = req.user.userId;
    //get comments from req
    let { articleId, comment } = req.body;
    //check article exists
    let articleDoc = await Article.findById(articleId);
    if (!articleDoc) {
      return res.status(404).json({ message: "Article not found" });
    }
    //adding comments to the article 
    let updatedArticle = await Article.findByIdAndUpdate(articleId,{$push: {comments: 
                        {user: userId,
                        comment: comment}}},
                        { new: true });
    //send response
    res.json({ message: "Comment added", payload: updatedArticle });
    
})
