import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/product.js';

// add product
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image'
                });
                return result.secure_url;
            })
        );

        await Product.create({
            ...productData,
            image: imagesUrl
        });
        return res.json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.log("error in addProduct function in productController.js");
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// get all products
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        return res.json({ success: true, products });
    } catch (error) {
        console.error("Error in productList function in productController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}


// get product by id
export const productById = async (req, res) => {
    try {
        // console.log(req.body)
        const { id } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        return res.json({ success: true, product });
    } catch (error) {
        console.error("Error in productById function in productController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}


// change product in stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        return res.json({ success: true, message: "Product stock updated successfully" });
    } catch (error) {
        console.error("Error in changeStock function in productController.js");
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}