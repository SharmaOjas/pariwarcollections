import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom' // Added for empty state navigation

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext)

  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const temp = []
      for (const pid in cartItems) {
        for (const size in cartItems[pid]) {
          if (cartItems[pid][size] > 0) {
            temp.push({
              _id: pid,
              size,
              quantity: cartItems[pid][size],
            })
          }
        }
      }
      setCartData(temp)
    }
  }, [cartItems, products])

  return (
    // ADDED: min-h-screen to fill the page, and a gradient for depth
    <div className="pt-24 pb-32 min-h-screen bg-gradient-to-b from-[#f2ece6] to-[#eeeee]">
      
      {/* TITLE SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col items-center justify-center text-center">
          <Title text1="YOUR" text2="SHOPPING BAG" />
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            Review your selected items before proceeding to secure checkout.
          </p>
          <div className="h-[3px] w-24 bg-[#53131f] mt-6 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20">
        
        {/* LEFT COLUMN: CART ITEMS */}
        <div className="flex flex-col gap-6">
          {cartData.length === 0 && (
            <div className="bg-white rounded-3xl p-20 text-center shadow-xl border border-white/50">
              <div className="w-24 h-24 bg-[#53131f]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 {/* You can replace this with a cart icon from assets if available */}
                 <span className="text-4xl"></span>
              </div>
              <p className="text-3xl font-serif text-[#53131f] mb-4">
                Your cart is empty
              </p>
              <p className="text-gray-500 mb-8 text-lg">
                Looks like you haven't added anything to your bag yet.
              </p>
              <Link to="/collection" className="inline-block px-10 py-4 bg-[#53131f] text-white rounded-full font-semibold hover:bg-[#3a0f1a] transition shadow-lg hover:shadow-xl hover:-translate-y-1">
                Continue Shopping
              </Link>
            </div>
          )}

          {cartData.map((item, i) => {
            const product = products.find(p => p._id === item._id)

            return (
              <div
                key={i}
                // ADDED: White background, shadow-md, and hover effects
                className="group bg-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row gap-8 items-center shadow-md hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-[#53131f]/10 relative overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative shrink-0">
                    <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full sm:w-40 sm:h-48 rounded-2xl object-cover shadow-sm"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-serif font-medium text-gray-900 leading-tight mb-2">
                        {product.name}
                    </h3>
                    
                    {/* Desktop Remove Button (Top Right) */}
                    <button
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="hidden sm:block text-gray-400 hover:text-red-600 transition p-2"
                    >
                        <img src={assets.bin_icon} className="w-5 h-5 opacity-50 hover:opacity-100" alt="remove" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-4">
                    
                    {/* Price & Size */}
                    <div className="space-y-2">
                        <p className="text-2xl font-semibold text-[#53131f]">
                            {currency}{product.price}
                        </p>
                        <div className="inline-block px-4 py-1.5 rounded-lg bg-[#f9f5f2] border border-[#e6ddd6] text-sm font-medium text-gray-600">
                            Size: <span className="text-black">{item.size}</span>
                        </div>
                    </div>

                    {/* Quantity Control - Styled as a pill */}
                    <div className="flex items-center bg-[#f9f5f2] rounded-full px-2 py-1 border border-[#e6ddd6] shadow-inner ml-auto">
                        <button
                        onClick={() =>
                            updateQuantity(item._id, item.size, item.quantity - 1)
                        }
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-[#53131f] hover:bg-white hover:shadow-sm transition"
                        >
                        −
                        </button>

                        <span className="w-12 text-center font-semibold text-lg text-gray-800">
                        {item.quantity}
                        </span>

                        <button
                        onClick={() =>
                            updateQuantity(item._id, item.size, item.quantity + 1)
                        }
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-[#53131f] hover:bg-white hover:shadow-sm transition"
                        >
                        +
                        </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Remove Button (Bottom) */}
                <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="sm:hidden w-full py-2 mt-2 text-red-500 text-sm font-semibold hover:bg-red-50 rounded-lg transition"
                >
                    Remove Item
                </button>
              </div>
            )
          })}
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        {/* ADDED: Sticky positioning with a nicer card design */}
        <div className="relative">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-28">
            <h2 className="text-2xl font-serif text-[#53131f] mb-6 border-b pb-4 border-gray-100">
                Order Summary
            </h2>
            
            <CartTotal />

            <div className="mt-8 space-y-4">
                <button
                onClick={() => {
                    if (cartData.length === 0) {
                    toast.error('Your cart is empty')
                    return
                    }
                    navigate('/place-order')
                }}
                disabled={cartData.length === 0}
                className={`w-full py-5 rounded-2xl text-lg font-bold tracking-wider shadow-lg transition-all transform active:scale-95 ${
                    cartData.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-[#53131f] text-white hover:bg-[#3f0e17] hover:shadow-[#53131f]/30 hover:-translate-y-1'
                }`}
                >
                CHECKOUT SECURELY
                </button>

                {/* Trust Badges / Extra Info to fill space */}
               
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart