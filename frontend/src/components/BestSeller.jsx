import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextBase'
import Title from './Title';
import ProductItem from './ProductItem';
import { motion } from 'framer-motion'

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
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
        className='text-center text-3xl py-8'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Title text1={'BEST'} text2={'SELLERS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        Our most loved designs, trusted by families and chosen for their elegance, quality, and traditional charm.        </p>
      </motion.div>

      <motion.div 
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6' 
        style={{ margin: '2%' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {bestSeller.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="aspect-square relative">
                  <div className="absolute inset-0 skeleton" />
                </div>
                <div className="p-4">
                  <div className="h-4 w-3/4 skeleton rounded mb-2" />
                  <div className="h-5 w-1/2 skeleton rounded" />
                </div>
              </div>
            ))
          : bestSeller.map((item,index)=>(
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductItem id={item._id} name={item.name} image={item.image} price={item.price} />
                </motion.div>
            ))
        }
      </motion.div>
    </motion.div>
  )
}

export default BestSeller
