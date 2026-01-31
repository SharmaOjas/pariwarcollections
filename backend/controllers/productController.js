import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import { triggerBackInStock } from "../utils/notificationService.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, sizes, bestseller, allowCustomSize, inventoryQuantity, inventoryStatus } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        let qty = Number(inventoryQuantity || 0);
        if (qty < 0) qty = 0;
        let status = inventoryStatus || 'Coming Soon';
        if (status !== 'Coming Soon') {
            status = qty > 0 ? 'In Stock' : 'Out of Stock';
        }

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            bestseller: bestseller === "true" ? true : false,
            allowCustomSize: allowCustomSize === "true" ? true : false,
            sizes: sizes ? JSON.parse(sizes) : [],
            inventoryQuantity: qty,
            inventoryStatus: status,
            inventoryAudit: [{
                changeType: 'init',
                prevQty: 0,
                newQty: qty,
                prevStatus: 'Coming Soon',
                newStatus: status,
                date: Date.now()
            }],
            image: imagesUrl,
            date: Date.now()
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(productData);
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, sizes, bestseller, allowCustomSize } = req.body

        const product = await productModel.findById(id)
        if (!product) {
            return res.json({ success: false, message: 'Product not found' })
        }

        // Handle image updates
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        let updatedImages = [...product.image]

        if (image1) {
            let result = await cloudinary.uploader.upload(image1.path, { resource_type: 'image' })
            updatedImages[0] = result.secure_url
        }
        if (image2) {
            let result = await cloudinary.uploader.upload(image2.path, { resource_type: 'image' })
            updatedImages[1] = result.secure_url
        }
        if (image3) {
            let result = await cloudinary.uploader.upload(image3.path, { resource_type: 'image' })
            updatedImages[2] = result.secure_url
        }
        if (image4) {
            let result = await cloudinary.uploader.upload(image4.path, { resource_type: 'image' })
            updatedImages[3] = result.secure_url
        }

        // Clean up undefined/null slots if original array was smaller, though usually we just replace specific indices
        // Ideally we want to keep the array clean. 
        // If the original product had 2 images, and we upload image3, updatedImages[2] will be set.

        // Remove null/undefined from array if any gap is created (less likely here as we strictly map 1-4)
        updatedImages = updatedImages.filter(img => img !== undefined && img !== null);

        await productModel.findByIdAndUpdate(id, {
            name,
            description,
            price: Number(price),
            category,
            sizes: sizes ? JSON.parse(sizes) : [],
            bestseller: bestseller === "true" ? true : false,
            allowCustomSize: allowCustomSize === "true" ? true : false,
            image: updatedImages
        })

        res.json({ success: true, message: "Product Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {

        if (process.env.NODE_ENV === 'development') {
            console.log('List products requested')
        }
        const products = await productModel.find({}).lean();
        res.json({ success: true, products })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating inventory
const updateInventory = async (req, res) => {
    try {
        const { id, quantity, status } = req.body
        if (process.env.NODE_ENV === 'development') {
            console.log('Update inventory requested', { id, quantity, status })
        }
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({ success: false, message: 'Product not found' })
        }

        let newQty = Number(quantity)
        if (isNaN(newQty) || newQty < 0) {
            return res.json({ success: false, message: 'Invalid quantity' })
        }

        let newStatus = status || product.inventoryStatus
        if (newStatus !== 'Coming Soon') {
            newStatus = newQty > 0 ? 'In Stock' : 'Out of Stock'
        }

        const auditEntry = {
            changeType: 'manual_adjust',
            prevQty: product.inventoryQuantity,
            newQty,
            prevStatus: product.inventoryStatus,
            newStatus,
            date: Date.now()
        }

        product.inventoryQuantity = newQty
        product.inventoryStatus = newStatus
        product.inventoryAudit.push(auditEntry)

        await product.save()
        if (auditEntry.prevStatus !== 'In Stock' && newStatus === 'In Stock') {
            await triggerBackInStock(product, auditEntry.prevStatus)
        }
        res.json({ success: true, message: 'Inventory Updated', product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        console.log('Single product requested', productId)
        const product = await productModel.findById(productId).lean()
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const stockCheck = async (req, res) => {
    try {
        const { id } = req.params
        console.log('Stock check requested', id)
        const product = await productModel.findById(id).lean()
        if (!product) {
            return res.json({ success: false, message: 'Product not found' })
        }
        const qty = Number(product.inventoryQuantity || 0)
        const status = product.inventoryStatus === 'Coming Soon' ? 'Coming Soon' : (qty > 0 ? 'In Stock' : 'Out of Stock')
        res.json({ success: true, status, quantity: qty })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const setHeroProduct = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.json({ success: false, message: 'Product id required' })
        }
        const exists = await productModel.findById(id)
        if (!exists) {
            return res.json({ success: false, message: 'Product not found' })
        }
        await productModel.updateMany({ featuredHero: true }, { featuredHero: false })
        await productModel.findByIdAndUpdate(id, { featuredHero: true })
        res.json({ success: true, message: 'Hero product updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, updateInventory, stockCheck, setHeroProduct, updateProduct }
