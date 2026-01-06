import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import axios from 'axios'
import { toast } from 'react-toastify'
import ProgressiveImage from '../components/ProgressiveImage'

const Product = () => {

  const { productId } = useParams()
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext)

  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [customSize, setCustomSize] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [subPhone, setSubPhone] = useState('')
  const [channelsEmail] = useState(true)
  const [channelsWhatsapp] = useState(false)
  const [preferredLanguage] = useState('en')
  const [submitting, setSubmitting] = useState(false)

  const computedStatus = productData
    ? productData.inventoryStatus === 'Coming Soon'
      ? 'Coming Soon'
      : (productData.inventoryQuantity || 0) > 0
        ? 'In Stock'
        : 'Out of Stock'
    : 'Coming Soon'

  /* ---------------- ZOOM LOGIC ---------------- */
  const [zoomEnabled, setZoomEnabled] = useState(false)
  const [zoomScale, setZoomScale] = useState(1.3)
  const [lensVisible, setLensVisible] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 })
  const [imgLoaded, setImgLoaded] = useState(false)

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

  const onImageLoad = (e) => {
    setImgNatural({ w: e.target.naturalWidth, h: e.target.naturalHeight })
    setImgLoaded(true)
  }

  const onEnter = () => zoomEnabled && imgLoaded && setLensVisible(true)
  const onLeave = () => setLensVisible(false)

  const onMove = (e) => {
    if (!lensVisible || !imgLoaded) return
    const rect = e.currentTarget.getBoundingClientRect()
    setLensPos({
      x: clamp(e.clientX - rect.left, 0, rect.width),
      y: clamp(e.clientY - rect.top, 0, rect.height)
    })
  }

  const toggleZoom = () => setZoomEnabled(z => !z)

  const onWheel = (e) => {
    if (!zoomEnabled) return
    const delta = e.deltaY < 0 ? 0.1 : -0.1
    setZoomScale(s => clamp(Number((s + delta).toFixed(2)), 1, 2.5))
  }

 

  /* ---------------- DATA LOAD ---------------- */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/product/single',
          { productId }
        )
        if (data.success) {
          setProductData(data.product)
          setImage(data.product.image[0])
        }
      } catch {
        products.forEach(item => {
          if (item._id === productId) {
            setProductData(item)
            setImage(item.image[0])
          }
        })
      }
    }
    loadProduct()
  }, [productId, backendUrl, products])

  /* ---------------- SUBSCRIBE ---------------- */
  const subscribeBackInStock = async () => {
    if (!subEmail && !subPhone) {
      toast.error('Enter email or phone')
      return
    }
    if (!channelsEmail && !channelsWhatsapp) {
      toast.error('Select at least one channel')
      return
    }

    try {
      setSubmitting(true)
      const { data } = await axios.post(
        backendUrl + '/api/notify/subscribe',
        {
          productId: productData._id,
          email: subEmail,
          phone: subPhone,
          channels: {
            email: channelsEmail,
            whatsapp: channelsWhatsapp
          },
          preferredLanguage
        }
      )

      data.success
        ? toast.success('Subscribed for back-in-stock')
        : toast.error(data.message)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }


  /* ---------------- RENDER ---------------- */
  return productData ? (
    <div className="pt-6 transition-opacity ease-in duration-500 opacity-100 pb-20 border-t border-gray-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Breadcrumbs */}
        <div className="flex items-center text-xs text-gray-500 mb-8 tracking-wide uppercase">
            <Link to='/' className="hover:text-black hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to='/collection' className="hover:text-black hover:underline">Collection</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">{productData.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT — IMAGES (Sticky on Desktop) */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 h-fit lg:sticky lg:top-24">

            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 lg:w-[15%] overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
              {productData.image.map((img, i) => (
                <div key={i} className="w-20 lg:w-full aspect-square">
                  <button
                    onClick={() => setImage(img)}
                    className={`block w-full h-full rounded-sm border transition-all duration-200 ${
                      image === img ? 'border-black opacity-100 ring-1 ring-black' : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                    }`}
                    aria-label="Select image"
                  >
                    <ProgressiveImage
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full rounded-sm"
                      imgClassName="object-cover"
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Main Image & Zoom */}
            <div
              className="lg:w-[85%] relative bg-white flex items-center justify-center rounded-sm overflow-hidden"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              onMouseMove={onMove}
              onWheel={onWheel}
              style={{ touchAction: 'none' }}
            >
              <ProgressiveImage
                src={image}
                alt={productData.name}
                onLoad={onImageLoad}
                className="w-full h-auto max-h-[700px]"
                imgClassName="object-cover hover:scale-[1.02] transition-transform duration-500"
                eager={true}
              />

              <button
                onClick={toggleZoom}
                className={`absolute top-4 right-4 text-[10px] font-bold tracking-widest px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md z-10 uppercase ${
                  zoomEnabled 
                    ? 'bg-black text-white' 
                    : 'bg-white/90 text-black shadow-md hover:bg-black hover:text-white'
                }`}
              >
                {zoomEnabled ? 'Zoom On' : 'Zoom'}
              </button>

              {lensVisible && zoomEnabled && imgLoaded && (
                <div
                  className="absolute border-2 border-white/50 rounded-full pointer-events-none shadow-2xl z-20 bg-white"
                  style={{
                    width: 180,
                    height: 180,
                    left: lensPos.x - 90,
                    top: lensPos.y - 90,
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${imgNatural.w * zoomScale}px ${imgNatural.h * zoomScale}px`,
                    backgroundPosition: `${-(lensPos.x * zoomScale - 90)}px ${-(lensPos.y * zoomScale - 90)}px`
                  }}
                />
              )}
            </div>

          </div>

          {/* RIGHT — INFO */}
          <div className="flex flex-col">

            <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 tracking-wide mb-2">
                {productData.name}
            </h1>

            {/* Ratings & Status Row */}
            <div className="flex items-center justify-between mb-6">
                {/* <div className="flex items-center gap-1">
                    <div className="flex text-yellow-500">
                        {[1,2,3,4].map(i => (
                            <img key={i} src={assets.star_icon} className="w-3.5 h-3.5" alt="star" />
                        ))}
                        <img src={assets.star_dull_icon} className="w-3.5 h-3.5" alt="star empty" />
                    </div>
                    <span className="text-xs text-gray-500 ml-2 border-b border-gray-300 pb-0.5">(122 Reviews)</span>
                </div> */}
                
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                    computedStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {computedStatus}
                </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-3xl font-medium text-gray-900">
                {currency}{productData.price}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-medium text-[#B89B2E] uppercase tracking-wide">Select Size</p>
                  {/* <button className="text-xs text-gray-500 underline hover:text-black">Size Guide</button> */}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {productData.sizes.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSize(item)}
                    className={`min-w-[3.5rem] h-12 px-2 border transition-all duration-200 text-sm font-medium ${
                      size === item 
                        ? 'border-black bg-black text-white' 
                        : 'border-[#B89B2E] text-gray-700 hover:border-black'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {productData.allowCustomSize && (
                <div className="flex gap-2 mt-4 max-w-sm">
                  <input
                    value={customSize}
                    onChange={(e) => {
                      setCustomSize(e.target.value)
                      setSize(e.target.value)
                    }}
                    className="border border-gray-300 px-4 py-2 w-full text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter custom size"
                  />
                  <button className="bg-gray-100 border border-gray-200 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <button
              disabled={computedStatus !== 'In Stock'}
              onClick={() => addToCart(productData._id, size)}
              className={`w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 mb-6 ${
                computedStatus === 'In Stock'
                  ? 'bg-[#53131f] text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {computedStatus === 'In Stock' ? 'Add to Cart' : 'Sold Out'}
            </button>
            
            

            {/* Back in Stock Notification */}
            {computedStatus !== 'In Stock' && (
              <div className="mb-10 bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Notify me when available
                </p>

                <div className="space-y-3">
                    <input
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="border border-gray-300 rounded-none px-4 py-3 w-full text-sm focus:outline-none focus:border-black focus:ring-0 transition-all placeholder-gray-400"
                      placeholder="Email Address"
                    />

                    <input
                      value={subPhone}
                      onChange={(e) => setSubPhone(e.target.value)}
                      className="border border-gray-300 rounded-none px-4 py-3 w-full text-sm focus:outline-none focus:border-black focus:ring-0 transition-all placeholder-gray-400"
                      placeholder="WhatsApp Number"
                    />
                </div>

                <button
                  onClick={subscribeBackInStock}
                  disabled={submitting}
                  className="mt-4 w-full bg-gray-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  {submitting ? 'Submitting…' : 'Notify Me'}
                </button>
              </div>
            )}

            {/* Description Only Section */}
            <div className="mt-2">
               <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Description</h3>
               <div className="text-gray-600 text-sm leading-relaxed space-y-4">
                  <p>{productData.description}</p>
                  <p>Handcrafted with precision, this piece is designed to be a timeless addition to your collection. Made from premium materials ensuring durability and long-lasting shine.</p>
               </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
       <div className="mt-24 border-t border-[#B89B2E]">

          
          <RelatedProducts category={productData.category} />
        </div>

      </div>
    </div>
  ) : null
}

export default Product
