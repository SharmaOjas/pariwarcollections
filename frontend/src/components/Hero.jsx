import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const Hero = () => {
  const { products } = useContext(ShopContext)
  const heroProduct = products.find(p => p.featuredHero)
  const heroImg = heroProduct?.image?.[0]

  return (
    <div className="relative flex w-full min-h-[520px] bg-[#f6eee8] overflow-hidden" style={{ marginTop: '4%' }}>

      {/* LEFT PANEL */}
      <div className="
        relative z-10
        w-full sm:w-[55%]
        flex items-center
        bg-[#f6eee8]
        rounded-r-[120px]
        px-10 sm:px-20
      ">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-[#b08d57]" />
            <p className="text-sm tracking-widest text-[#7a1f2b]">
              OUR BESTSELLERS
            </p>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif text-[#53131f] mb-6">
            Latest Arrivals
          </h1>

          <button className="
            mt-4
            px-6 py-3
            bg-[#53131f]
            text-[#f6eee8]
            rounded-full
            tracking-wide
          ">
            SHOP NOW
          </button>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="absolute right-0 top-0 h-full w-full sm:w-[55%]">
        <img
          src={heroImg}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

    </div>
  )
}

export default Hero
