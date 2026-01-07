import { useContext, useEffect, useState, useCallback } from 'react'
import { ShopContext } from '../context/ShopContextBase'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { motion } from 'framer-motion'

const Collection = () => {

  const { products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const applyFilter = useCallback(() => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    setFilterProducts(productsCopy)

  }, [products, showSearch, search, category])

  const sortProduct = useCallback(() => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }, [filterProducts, sortType, applyFilter])

  useEffect(()=>{
      applyFilter();
  },[applyFilter])

  useEffect(()=>{
    sortProduct();
  },[sortProduct])

  return (
    <motion.div 
      className='flex flex-col sm:flex-row gap-6 sm:gap-10 pt-12 pb-8 px-3 sm:px-6 relative overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Decorative Elements */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
      </div>
      
      {/* Filter Options */}
      <motion.div 
        className='min-w-60 px-4 relative z-10'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
    <motion.p 
      onClick={() => setShowFilter(!showFilter)} 
      className='my-4 text-2xl flex items-center cursor-pointer gap-2 font-semibold text-gray-800 hover:text-[#53131f] transition-colors duration-300'
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
        <span className='text-[#53131f] text-xl'></span> FILTERS
        <motion.img 
          className={`h-3 sm:hidden`} 
          src={assets.dropdown_icon} 
          alt="" 
          animate={{ rotate: showFilter ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        />
    </motion.p>

    {/* Category Filter */}
    <motion.div 
      className={`border-2 border-[#f6eee8] pl-6 pr-4 py-6 mt-6 rounded-xl shadow-lg bg-gradient-to-br from-white to-[#f6eee8] backdrop-blur-sm ${showFilter ? '' : 'hidden'} sm:block`}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
        <motion.p 
          className='mb-4 text-xl font-bold text-[#53131f] border-b border-[#b08d57] pb-2'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          CATEGORIES
        </motion.p>
        <div className='flex flex-col gap-3 text-base font-medium text-gray-700'>
            
            {[
                { name: 'Hair Accessories'},
                { name: 'Neck Accessories' },
                { name: 'Ear Accessories' },
                { name: 'Finger Accessories' },
                { name: 'Nose Accessories' },
                { name: 'Foot Accessories' },
                { name: 'Jewellery Sets' },
                { name: 'Traditional Jewellery' },
                { name: 'Hand Accessories' },
                { name: 'Waist Accessories' }
            ].map((cat, index) => (
                <motion.label 
                  key={cat.name} 
                  className='flex items-center gap-3 cursor-pointer hover:bg-[#53131f]/10 p-3 rounded-lg transition-all duration-300 group'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                    <motion.input 
                      className='w-4 h-4 accent-[#53131f] cursor-pointer' 
                      type="checkbox" 
                      value={cat.name} 
                      onChange={toggleCategory}
                      whileHover={{ scale: 1.1 }}
                    />
                    <span className='text-gray-700 group-hover:text-[#53131f] font-medium transition-colors duration-300'>{cat.name}</span>
                </motion.label>
            ))}

        </div>

        {/* Clear Filters Button */}
        {category.length > 0 && (
          <motion.button
            onClick={() => setCategory([])}
            className='mt-4 w-full py-2 px-4 bg-[#53131f] text-white rounded-lg hover:bg-[#3a0f1a] transition-colors duration-300 font-medium'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear All Filters ({category.length})
          </motion.button>
        )}
    </motion.div>
</motion.div>


      {/* Right Side */}
      <motion.div 
        className='flex-1 px-2 sm:px-4 relative z-10'
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >

        {/* Decorative Header Element */}
        <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#f6eee8] to-transparent rounded-full opacity-30 -z-10'></div>

        <motion.div 
          className='flex justify-between items-center text-base sm:text-2xl mb-8 p-6 bg-gradient-to-r from-[#f6eee8] via-white to-[#f6eee8] rounded-2xl shadow-lg border border-[#b08d57]/20 relative overflow-hidden'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Decorative corner element */}
          <div className='absolute top-0 left-0 w-16 h-16 bg-[#53131f] opacity-5 rounded-br-full'></div>
          
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className='relative z-10'
            >
              <Title text1={'ALL'} text2={'COLLECTIONS'} />
              <motion.p 
                className='text-base text-gray-600 mt-2 font-medium'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {filterProducts.length} {filterProducts.length === 1 ? 'product' : 'products'} found
              </motion.p>
            </motion.div>
            {/* Product Sort */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className='relative z-10'
            >
              <select 
                onChange={(e)=>setSortType(e.target.value)} 
                className='border-2 border-[#b08d57] text-base px-4 py-2 rounded-lg bg-white hover:border-[#53131f] focus:border-[#53131f] focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md'
              >
                <option value="relavent">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </motion.div>
        </motion.div>

        {/* Active Filters Display */}
        {category.length > 0 && (
          <motion.div 
            className='mb-6 p-4 bg-gradient-to-r from-[#f6eee8] to-white rounded-xl border border-[#b08d57]/30 shadow-sm relative overflow-hidden'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {/* Decorative line */}
            <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#53131f] to-[#b08d57]'></div>
            
            <div className='flex flex-wrap items-center gap-3 pl-2'>
              <span className='text-base font-semibold text-[#53131f] flex items-center gap-2'>
                <span className='text-lg'></span> Active filters:
              </span>
              {category.map((cat, index) => (
                <motion.span 
                  key={cat}
                  className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#53131f] to-[#7a1f2b] text-white text-sm rounded-full font-medium shadow-sm'
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  {cat}
                  <button
                    onClick={() => setCategory(prev => prev.filter(item => item !== cat))}
                    className='ml-1 hover:text-red-300 transition-colors text-sm font-bold'
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Visual Separator */}
        <motion.div 
          className='w-full h-px bg-gradient-to-r from-transparent via-[#b08d57]/30 to-transparent mb-8'
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        ></motion.div>

        {/* Products Grid or Empty State */}
        {filterProducts.length > 0 ? (
          <motion.div 
            className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 gap-y-4 md:gap-y-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {
              filterProducts.map((item,index)=>(
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className='transform transition-all duration-300'
                >
                  <ProductItem large name={item.name} id={item._id} price={item.price} image={item.image} />
                </motion.div>
              ))
            }
          </motion.div>
        ) : (
          <motion.div 
            className='flex flex-col items-center justify-center py-20 text-center relative'
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Decorative background elements */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-64 h-64 bg-gradient-to-br from-[#f6eee8]/20 to-[#b08d57]/10 rounded-full blur-3xl'></div>
            </div>
            
            <motion.div 
              className='relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#b08d57]/20'
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div 
                className='text-6xl mb-6'
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                
              </motion.div>
              <h3 className='text-3xl font-bold text-gray-800 mb-3'>No products found</h3>
              <p className='text-base text-gray-600 mb-6 max-w-md'>Try adjusting your filters or search terms to discover more beautiful pieces</p>
              <motion.button
                onClick={() => {
                  setCategory([]);
                  setSortType('relavent');
                }}
                className='px-8 py-3 bg-gradient-to-r from-[#53131f] to-[#7a1f2b] text-white rounded-xl hover:from-[#3a0f1a] hover:to-[#53131f] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl'
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset All Filters
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

    </motion.div>
  )
}

export default Collection
