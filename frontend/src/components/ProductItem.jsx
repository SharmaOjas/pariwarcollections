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
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition ${large ? 'md:rounded-3xl' : ''}`}
    >

      {/* Image */}
      <Link to={`/product/${id}`} onClick={() => scrollTo(0, 0)}>
        <div className={`relative overflow-hidden ${large ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-square'}`}>
          <ProgressiveImage
            src={image[0]}
            alt={name}
            className="w-full h-full"
            imgClassName={`${large ? 'h-full' : ''} transition-transform duration-500 hover:scale-110`}
            sizes={large ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
            fetchPriority="auto"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </Link>

      {/* Content */}
      <div className={`p-4 ${large ? 'md:p-5' : ''}`}>
        <p className="text-base sm:text-lg font-semibold text-gray-800 leading-snug line-clamp-2">
          {name}
        </p>
        <p className="text-lg sm:text-xl font-bold text-[#53131f] mt-1">
          {currency}{price}
        </p>

        {/* Buttons — ALWAYS visible */}
        <div className="mt-4 flex gap-2">

          {/* View */}
          <Link
  to={`/product/${id}`}
  onClick={() => scrollTo(0, 0)}
  className={`w-1/2 h-12 flex items-center justify-center text-center font-medium rounded-lg border border-[#53131f] text-[#53131f] hover:bg-[#53131f] hover:text-white transition ${
    large ? 'text-sm' : 'text-xs'
  }`}
>
  View
</Link>


          {/* Add / Out */}
          <motion.button
            onClick={handleAddToCart}
            disabled={!isInStock}
            whileTap={{ scale: 0.96 }}
            className={`w-1/2 py-3 text-sm sm:text-base font-semibold rounded-xl transition ${
              isInStock
                ? 'bg-[#53131f] text-white hover:bg-[#3a0f1a]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>

        </div>
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
