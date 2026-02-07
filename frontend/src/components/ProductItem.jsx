import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContextBase'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import ProgressiveImage from './ProgressiveImage'

const ProductItem = ({ id, image, name, price, large = false }) => {
  const { currency, addToCart, products } = useContext(ShopContext)
  const [showSizes, setShowSizes] = useState(false)

  const productData = products.find(item => item._id === id)
  const sizes = productData?.sizes || []

  const isInStock =
    productData &&
    productData.inventoryStatus === 'In Stock' &&
    (productData.inventoryQuantity || 0) > 0

  const handleAddToCart = () => {
    if (!isInStock) return

    if (sizes.length === 0) addToCart(id, 'Default')
    else if (sizes.length === 1) addToCart(id, sizes[0])
    else setShowSizes(true)
  }

  const handleSizeSelect = (size) => {
    addToCart(id, size)
    setShowSizes(false)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`group cursor-pointer ${large ? 'md:rounded-3xl' : ''}`}
    >

      {/* Image */}
      <Link to={`/product/${id}`} onClick={() => scrollTo(0, 0)} className="block overflow-hidden relative">
          <ProgressiveImage
            src={image[0]}
            alt={name}
            className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-105"
            imgClassName="w-full h-full object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fetchPriority="auto"
          />
          {/* Add to Cart Overlay Button */}
           <motion.button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={!isInStock}
            whileTap={{ scale: 0.96 }}
            className={`absolute bottom-4 right-4 p-3 rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
              isInStock
                ? 'bg-white text-black hover:bg-gray-100'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
             aria-label="Add to cart"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </motion.button>
      </Link>

      {/* Content */}
      <div className="pt-3 text-center">
        <p className="text-sm font-prata text-gray-900 leading-tight">
          {name}
        </p>
        <p className="text-sm font-medium text-gray-600 mt-1 font-outfit">
          {currency}{price}
        </p>


      </div>

      {/* Size Modal */}
      {showSizes && sizes.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowSizes(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold mb-4 text-center">
              Select Size
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => handleSizeSelect(size)}
                  className="py-2 text-sm border rounded hover:bg-[#53131f] hover:text-white transition"
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSizes(false)}
              className="w-full py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  large: PropTypes.bool
}

export default ProductItem
