import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    allowCustomSize: { type: Boolean, default: false },
    inventoryQuantity: { type: Number, default: 0, min: 0 },
    inventoryStatus: { type: String, default: 'Coming Soon' },
    inventoryAudit: { type: Array, default: [] },
    featuredHero: { type: Boolean, default: false },
    date: { type: Number, required: true }
})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel
