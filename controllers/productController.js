import { validationResult } from "express-validator"
import ProductModel from "../model/ProductModel.js";

export const addNewProduct = async(req,res) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            success : false,
            message : errors.array()[0].message
        })
    }

    const {product_name,product_description,product_price,product_category,product_used,product_detail} = req.body

    try {
        const productCreate = await ProductModel.create({
         name : product_name,
         description : product_description,
         price : product_price,
         category : product_category,
         usedFor : product_used,
         details : product_detail,
         seller : req.userId
        })
        return res.status(201).json({
            success : true,
            message : `Product successfully add to product list `,
            productCreate
        })
        } catch (error) {
            return res.status(422).json({
                success : false,
                message : error.message
            })
        }
}

export const getAllProduct = async(req,res) => {
    try {
        const productGetAll = await ProductModel.find({seller : req.userId}).sort({
            createdAt : -1
        })
        console.log(productGetAll);

        return res.status(200).json({
            success : true,
            message : `Product All List successfully show list`,
            productGetAll
        })
        } catch (error) {
            return res.status(422).json({
                success : false,
                message : error.message
            })
        }
}