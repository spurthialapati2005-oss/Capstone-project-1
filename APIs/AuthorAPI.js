import exp from "express"
import { UserTypeModel } from "../models/UserModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js"
import { register } from "../services/authService.js"
import { Article } from '../models/ArticleModel.js';
export const authorRoute = exp.Router()

//Register author
authorRoute.post("/users", async (req, res) =>{
    //get user obj from req
    let userObj = req.body;
    //call register
    const newUserObj = await register({ ...userObj, role:"AUTHOR" });
    //send res
    res.status(201).json({ message:"author created", payload: newUserObj });

});


//create article - (protected route)
authorRoute.post('/articles', verifyToken, checkAuthor, async(req, res) => {
    //get article from req
    let article = req.body;
    //create article doc
    let newArticleDoc = new Article(article)
    //save
    let createdArticleDoc = await newArticleDoc.save()
    //send res
    res.status(201).json({message: "article created", payload: createdArticleDoc})
})

//read articles of author - (protected route)
authorRoute.get('/articles/:authorId', verifyToken, checkAuthor, async(req, res) => {
    //get author id
    let aId = req.params.authorId;
    //read articles by this author
    let articles = await Article.find({author: aId, isArticleActive: true}).populate("author", "firstname email")
    //send res
    res.status(200).json({message:"articles", payload: articles})
})

//edit articles - (protected route)
authorRoute.put("/articles", verifyToken, checkAuthor, async(req, res) => {
    //get modified article from req
    let { articleId, title, category, content, author } = req.body
    //find article
    let articleofDB = await Article.findById({ _id:articleId, author:author})
    if(!articleofDB){
        return res.status(401).json({message:"Article not found"})
    }

    //update the article
    let updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    {
        $set: { title, category, content },
    },
    { new: true })
    //send res(updated article)
    res.status(200).json({message:"Article Updated", payload: updatedArticle})
})

//delete (soft delete) article
authorRoute.delete("/articles/:articleId", verifyToken, checkAuthor, async(req, res) => {
    let articleId = req.params.articleId
    
    let deletedArticle = await Article.findOneAndUpdate({_id:articleId, author:req.user.userId},{$set:{isArticleActive:false}},{new:true})
    if(!deletedArticle){
        return res.status(401).json({message:"Article not found"})
    }
    res.status(200).json({message:"Article Deleted", payload: deletedArticle});
})