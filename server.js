import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routers/authRoute.js";
import productRoute from "./routers/productRoute.js";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import "./passport.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const DB = process.env.MONGO_URL;

// MiddleWare
app.use(bodyParser.json());
app.use(cors({origin : "*"}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', authRoute);
app.use('/api', productRoute);

app.use("/", (req, res) => {
    res.json({ message: "Hello Welcome from NodeJs Server" });
});

mongoose.connect(DB).then(() => {
    app.listen(port, _ => {
        console.log(`Server is running on port ${port} and connected to database`);
    });
}).catch((error) => {
    console.log(error);
});
