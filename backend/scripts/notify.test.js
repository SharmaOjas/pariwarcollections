import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/mongodb.js'
import productModel from '../models/productModel.js'
import subscriptionModel from '../models/subscriptionModel.js'
import { triggerBackInStock } from '../utils/notificationService.js'

const run = async () => {
  process.env.NOTIFY_DRY_RUN = 'true'
  await connectDB()
  const p = await productModel.create({
    name: 'Notify Test Product',
    description: 'desc',
    price: 100,
    image: ['https://via.placeholder.com/300'],
    category: 'Test',
    subCategory: 'Test',
    sizes: ['Free Size'],
    bestseller: false,
    allowCustomSize: false,
    inventoryQuantity: 0,
    inventoryStatus: 'Out of Stock',
    date: Date.now()
  })
  await subscriptionModel.create({
    userId: 'test-user',
    email: process.env.TEST_EMAIL || 'test@example.com',
    phone: process.env.TEST_PHONE || '',
    productId: p._id.toString(),
    channels: { email: true, whatsapp: false },
    preferredLanguage: 'en',
    active: true
  })
  p.inventoryQuantity = 5
  p.inventoryStatus = 'In Stock'
  await p.save()
  await triggerBackInStock(p, 'Out of Stock')
  console.log('Triggered notifications for', p._id.toString())
  await productModel.findByIdAndDelete(p._id)
  await mongoose.connection.close()
}

run().catch(async (e) => {
  console.error(e)
  await mongoose.connection.close()
})

