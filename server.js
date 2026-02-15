import exp from 'express'
import { connect } from 'mongoose'
import { userRoute } from './APIs/UserAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { config } from 'dotenv'
import  cookieParser  from 'cookie-parser'
import { commonRoute } from './APIs/CommonAPI.js'
import { checkUser } from "./middlewares/checkUser.js"


config() // process.env

//create express application
const app = exp()   

//add body parser middleware
app.use(exp.json())

//add cookie parser middleware
app.use(cookieParser())

//connect APIs
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use('/common-api',commonRoute)

//connect to db
const connectDB  = async() => {
    try {
    await connect(process.env.DB_URL)
    console.log("DB connected successfully")
    //start http server
    app.listen(process.env.PORT,()=>console.log(`Server started`))
    } catch (err) {
        console.log("DB connection error:",err)
    }
}

connectDB()

//dealing w invalid path
app.use((req, res, next) => {
    res.json({ message: `${req.url} is Invalid path`})
})

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.json({ message:"error", reason: err.message });
});