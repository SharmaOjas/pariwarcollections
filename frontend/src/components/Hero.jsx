import { useContext } from 'react'
import { ShopContext } from '../context/ShopContextBase'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProgressiveImage from './ProgressiveImage'

const Hero = () => {
  const { products } = useContext(ShopContext)
  const heroProduct = products.find(p => p.featuredHero)
  const heroImg = heroProduct?.image?.[0]
  const navigate = useNavigate()

  return (
    <motion.div 
      className="relative flex w-full min-h-[520px] bg-[#f6eee8] overflow-hidden" 
      style={{ marginTop: '4%' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >

      {/* LEFT PANEL */}
      <motion.div 
        className="
          relative z-10
          w-full sm:w-[55%]
          flex items-center
          bg-[#f6eee8]
          rounded-r-[120px]
          px-10 sm:px-20
        "
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div>
          <motion.div 
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="w-10 h-[2px] bg-[#b08d57]" />
            <p className="text-sm tracking-widest text-[#7a1f2b]">
              OUR BESTSELLERS
            </p>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl font-serif text-[#53131f] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Latest Arrivals
          </motion.h1>

          <motion.button 
            className="
              mt-4
              px-6 py-3
              bg-[#53131f]
              text-[#f6eee8]
              rounded-full
              tracking-wide
            "
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            onClick={() => navigate('/collection')}
          >
            SHOP NOW
          </motion.button>
        </div>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div 
        className="absolute right-0 top-0 h-full w-full sm:w-[55%]"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <ProgressiveImage
          src={heroImg}
          alt="Featured"
          className="h-full w-full"
          imgClassName="object-cover"
          eager={true}
          sizes="(max-width: 640px) 100vw, 55vw"
          fetchPriority="high"
        />
      </motion.div>

    </motion.div>
  )
}

export default Hero
