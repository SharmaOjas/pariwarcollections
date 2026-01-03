import productModel from "../models/productModel.js";
import { triggerBackInStock } from "./notificationService.js";

export const reserveInventory = async (items) => {
  const reserved = []
  for (const item of items) {
    const needed = Number(item.quantity) || 0
    if (needed <= 0) continue;
    const updated = await productModel.findOneAndUpdate(
      { _id: item._id, inventoryQuantity: { $gte: needed } },
      { $inc: { inventoryQuantity: -needed } },
      { new: true }
    )
    if (!updated) {
      if (reserved.length) {
        await releaseInventory(reserved)
      }
      throw new Error(`Out of Stock: ${item.name}`)
    }
    const prevQty = (updated.inventoryQuantity || 0) + needed
    const prevStatus = prevQty > 0 ? 'In Stock' : 'Out of Stock'
    const newStatus = (updated.inventoryQuantity || 0) > 0 ? 'In Stock' : 'Out of Stock'
    await productModel.findByIdAndUpdate(item._id, {
      inventoryStatus: newStatus,
      $push: {
        inventoryAudit: {
          changeType: 'reserve',
          prevQty,
          newQty: updated.inventoryQuantity || 0,
          prevStatus,
          newStatus,
          date: Date.now()
        }
      }
    })
    reserved.push({ _id: item._id, quantity: needed })
  }
  return reserved
}

export const releaseInventory = async (items) => {
  for (const item of items) {
    const amount = Number(item.quantity) || 0
    if (amount <= 0) continue;
    const updated = await productModel.findByIdAndUpdate(
      item._id,
      { $inc: { inventoryQuantity: amount } },
      { new: true }
    )
    if (!updated) continue;
    const prevQty = (updated.inventoryQuantity || 0) - amount
    const prevStatus = prevQty > 0 ? 'In Stock' : 'Out of Stock'
    const newStatus = (updated.inventoryQuantity || 0) > 0 ? 'In Stock' : 'Out of Stock'
    await productModel.findByIdAndUpdate(item._id, {
      inventoryStatus: newStatus,
      $push: {
        inventoryAudit: {
          changeType: 'release',
          prevQty,
          newQty: updated.inventoryQuantity || 0,
          prevStatus,
          newStatus,
          date: Date.now()
        }
      }
    })
    if (prevStatus !== 'In Stock' && newStatus === 'In Stock') {
      await triggerBackInStock(updated, prevStatus)
    }
  }
}
