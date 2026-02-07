import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextBase'
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion'

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[products])

  return (
    <motion.div 
      className='my-10'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className='text-center py-8 text-3xl'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
          <Title text1={'LATEST'} text2={'COLLECTIONS'} />
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          A fresh expression of timeless tradition. Explore our newest designs, thoughtfully curated to add grace to every occasion.
          </p>
      </motion.div>

      {/* Rendering Products */}
      <motion.div 
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6' 
        style={{ margin: '2%' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {latestProducts.length === 0
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-gray-100">
                  <div className="absolute inset-0 skeleton h-full w-full" />
                </div>
                <div className="text-center space-y-2">
                  <div className="h-4 w-3/4 skeleton rounded mx-auto" />
                  <div className="h-4 w-1/2 skeleton rounded mx-auto" />
                </div>
              </div>
            ))
          : latestProducts.map((item,index)=>(
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
            </motion.div>
          ))
        }
      </motion.div>
    </motion.div>
  )
}

export default LatestCollection
