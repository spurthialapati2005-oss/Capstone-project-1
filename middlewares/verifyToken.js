import jwt from "jsonwebtoken"
import { config } from "dotenv"
config();

export const verifyToken = async(req, res, next) => {
    //read token from req
    let token = req.cookies.token;
    console.log("token:", token)
    if(token === undefined){
        return res.status(401).json({message:"Unauthorized req. Plz login"})
    }
    //verify the validity of the token ( decoding the token )
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    //store decoded token in req.user so that we can have userid and role
    req.user = decodedToken;

    //forward req to next middleware
    next();
}
