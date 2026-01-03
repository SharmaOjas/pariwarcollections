import mongoose from 'mongoose'
import 'dotenv/config'
import connectDB from '../config/mongodb.js'
import productModel from '../models/productModel.js'
import { fileURLToPath } from 'url'
import path from 'path'
import { reserveInventory, releaseInventory } from '../utils/inventory.js'

const run = async () => {
  await connectDB()
  const p = new productModel({
    name: 'Test Item',
    description: 'desc',
    price: 100,
    image: [],
    category: 'Test',
    sizes: ['Free Size'],
    bestseller: false,
    allowCustomSize: false,
    inventoryQuantity: 2,
    inventoryStatus: 'In Stock',
    date: Date.now()
  })
  await p.save()
  const id = p._id
  const items = [{ _id: id, name: 'Test Item', quantity: 1, price: 100 }]
  await reserveInventory(items)
  await reserveInventory(items)
  let failed = false
  try {
    await reserveInventory(items)
  } catch (e) {
    failed = true
    console.log('Expected failure:', e.message)
  }
  if (!failed) {
    throw new Error('Oversell allowed')
  }
  await releaseInventory([{ _id: id, quantity: 2 }])
  const prod = await productModel.findById(id).lean()
  console.log('Final qty:', prod.inventoryQuantity, 'status:', prod.inventoryStatus)
  await productModel.findByIdAndDelete(id)
  await mongoose.connection.close()
}

run().catch(async (e) => {
  console.error(e)
  await mongoose.connection.close()
})
