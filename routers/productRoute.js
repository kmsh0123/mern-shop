import { Router } from "express";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {addNewProduct} from "../controllers/productController.js";
import {getAllProduct} from "../controllers/productController.js";



const router = Router();

router.post("/create",[
    body("product_name")
    .trim()
    .notEmpty()
    .withMessage("product_name must have"),

    body("product_description")
    .trim()
    .notEmpty()
    .withMessage("product_description must have"),

    body("product_price")
    .trim()
    .notEmpty()
    .withMessage("product_price must have"),

    body("product_category")
    .trim()
    .notEmpty()
    .withMessage("product_category must have"),

    body("product_used")
    .trim()
    .notEmpty()
    .withMessage("Product_used must have"),
    
    body("product_detail")
    .isArray()
    .withMessage("product_detail must have"),

],isAuthenticated,addNewProduct)

router.get("/productList",isAuthenticated,getAllProduct)


export default router;
