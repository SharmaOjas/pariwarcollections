import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {

  const { productId } = useParams();
  const { products, currency ,addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [customSize, setCustomSize] = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [subPhone, setSubPhone] = useState('')
  const [channelsEmail, setChannelsEmail] = useState(true)
  const [channelsWhatsapp, setChannelsWhatsapp] = useState(false)
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [submitting, setSubmitting] = useState(false)
  const computedStatus = productData ? (productData.inventoryStatus === 'Coming Soon' ? 'Coming Soon' : ((productData.inventoryQuantity || 0) > 0 ? 'In Stock' : 'Out of Stock')) : 'Coming Soon';

  const [zoomEnabled, setZoomEnabled] = useState(false)
  const [zoomScale, setZoomScale] = useState(1.3)
  const [lensVisible, setLensVisible] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 })
  const [imgLoaded, setImgLoaded] = useState(false)
  const [pinchStart, setPinchStart] = useState(0)
  const [activePointers, setActivePointers] = useState({})

  const onImageLoad = (e) => {
    setImgNatural({ w: e.target.naturalWidth, h: e.target.naturalHeight })
    setImgLoaded(true)
  }
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max)
  const onEnter = () => { if (zoomEnabled && imgLoaded) setLensVisible(true) }
  const onLeave = () => setLensVisible(false)
  const onMove = (e) => {
    if (!lensVisible || !imgLoaded) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = clamp(e.clientX - rect.left, 0, rect.width)
    const y = clamp(e.clientY - rect.top, 0, rect.height)
    setLensPos({ x, y })
  }
  const toggleZoom = () => setZoomEnabled((z) => !z)
  const onWheel = (e) => {
    if (!zoomEnabled) return
    const delta = e.deltaY < 0 ? 0.1 : -0.1
    setZoomScale((s) => clamp(Number((s + delta).toFixed(2)), 1.0, 2.5))
  }
  const getDistance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y)
  const onPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = e.pointerId
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setActivePointers((prev) => ({ ...prev, [id]: pos }))
    if (Object.keys(activePointers).length + 1 >= 2) {
      const ids = Object.keys({ ...activePointers, [id]: pos })
      const p1 = activePointers[ids[0]] || pos
      const p2 = activePointers[ids[1]] || pos
      setPinchStart(getDistance(p1, p2))
      if (!zoomEnabled && imgLoaded) {
        setZoomEnabled(true)
        setLensVisible(true)
      }
    } else {
      if (zoomEnabled && imgLoaded) setLensVisible(true)
    }
  }
  const onPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = e.pointerId
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setActivePointers((prev) => ({ ...prev, [id]: pos }))
    if (Object.keys(activePointers).length >= 2) {
      const ids = Object.keys(activePointers)
      if (ids.length >= 2) {
        const p1 = activePointers[ids[0]]
        const p2 = activePointers[ids[1]]
        const dist = getDistance(p1, p2)
        if (pinchStart > 0) {
          const ratio = dist / pinchStart
          setZoomScale((s) => clamp(Number((s * ratio).toFixed(2)), 1.0, 3.0))
        }
      }
    } else {
      if (lensVisible && imgLoaded) {
        const x = clamp(e.clientX - rect.left, 0, rect.width)
        const y = clamp(e.clientY - rect.top, 0, rect.height)
        setLensPos({ x, y })
      }
    }
  }
  const onPointerUp = (e) => {
    const id = e.pointerId
    setActivePointers((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    if (Object.keys(activePointers).length < 2) {
      setPinchStart(0)
    }
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await axios.post(backendUrl + '/api/product/single', { productId })
        if (data.success) {
          setProductData(data.product)
          setImage(data.product.image[0])
        } else {
          // fallback to context list if any issue
          products.map((item) => {
            if (item._id === productId) {
              setProductData(item)
              setImage(item.image[0])
            }
            return null;
          })
        }
      } catch (error) {
        products.map((item) => {
          if (item._id === productId) {
            setProductData(item)
            setImage(item.image[0])
          }
          return null;
        })
      }
    }
    loadProduct();
  }, [productId, backendUrl, products])

  const subscribeBackInStock = async () => {
    try {
      if (!productData?._id) return
      const email = subEmail.trim()
      const phone = subPhone.trim()
      if (!email && !phone) {
        toast.error('Enter email or phone')
        return
      }
      if (!channelsEmail && !channelsWhatsapp) {
        toast.error('Select at least one channel')
        return
      }
      setSubmitting(true)
      const payload = {
        productId: productData._id,
        email,
        phone,
        channels: { email: channelsEmail, whatsapp: channelsWhatsapp },
        preferredLanguage
      }
      const { data } = await axios.post(backendUrl + '/api/notify/subscribe', payload)
      if (data.success) {
        toast.success('Subscribed for back-in-stock')
        setSubEmail('')
        setSubPhone('')
      } else {
        toast.error(data.message || 'Subscription failed')
      }
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <div
                className='relative w-full overflow-hidden border bg-white select-none'
                role='img'
                aria-label='Zoomable product image'
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onMouseMove={onMove}
                onWheel={onWheel}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{ touchAction: 'none' }}
              >
                {!imgLoaded ? (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='animate-pulse w-12 h-12 rounded-full border-4 border-gray-300 border-t-gray-600'></div>
                  </div>
                ) : null}
                <img
                  className='w-full h-auto block'
                  src={image}
                  alt={productData.name}
                  onLoad={onImageLoad}
                />
                <button
                  type='button'
                  aria-pressed={zoomEnabled}
                  onClick={toggleZoom}
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded ${zoomEnabled ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {zoomEnabled ? 'Zoom On' : 'Zoom Off'}
                </button>
                <div className='absolute top-3 left-3 text-xs bg-white/80 border px-2 py-1 rounded'>
                  Click to Enable Zoom or Pinch
                </div>
                <div className='absolute bottom-3 right-3 flex items-center gap-2 bg-white/80 border px-2 py-1 rounded'>
                  <button type='button' onClick={()=>setZoomScale((s)=>clamp(Number((s-0.1).toFixed(2)),1.0,3.0))} className='px-2 border rounded'>-</button>
                  <span className='text-xs'>{zoomScale.toFixed(2)}x</span>
                  <button type='button' onClick={()=>setZoomScale((s)=>clamp(Number((s+0.1).toFixed(2)),1.0,3.0))} className='px-2 border rounded'>+</button>
                </div>
                {lensVisible && zoomEnabled && imgLoaded ? (
                  <div
                    aria-hidden='true'
                    className='absolute rounded-full border-2 border-gray-300 shadow-[0_0_0_4px_rgba(255,255,255,0.6)]'
                    style={{
                      width: 120,
                      height: 120,
                      left: lensPos.x - 60,
                      top: lensPos.y - 60,
                      backgroundImage: `url(${image})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: `${imgNatural.w * zoomScale}px ${imgNatural.h * zoomScale}px`,
                      backgroundPosition: `${-(lensPos.x * zoomScale - 60)}px ${-(lensPos.y * zoomScale - 60)}px`,
                      pointerEvents: 'none'
                    }}
                  />
                ) : null}
              </div>
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-2 text-sm'>{computedStatus}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
              {productData.allowCustomSize ? (
                <div className='flex gap-2 mt-3'>
                  <input
                    value={customSize}
                    onChange={(e)=>{ setCustomSize(e.target.value); setSize(e.target.value); }}
                    className='border py-2 px-4 bg-white'
                    type='text'
                    placeholder='Enter custom size'
                  />
                  <button
                    onClick={()=> customSize && setSize(customSize)}
                    className='border py-2 px-4 bg-gray-100'
                    type='button'
                  >
                    Use Custom Size
                  </button>
                </div>
              ) : null}
          </div>
          <button
            disabled={computedStatus !== 'In Stock'}
            onClick={()=>addToCart(productData._id,size)}
            className={`px-8 py-3 text-sm ${computedStatus === 'In Stock' ? 'bg-black text-white active:bg-gray-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            ADD TO CART
          </button>
          {computedStatus !== 'In Stock' ? (
            <div className='mt-6 border rounded p-4 sm:w-4/5'>
              <p className='text-sm font-medium mb-3'>Notify me when available</p>
              <div className='flex flex-col gap-3'>
                <input
                  value={subEmail}
                  onChange={(e)=>setSubEmail(e.target.value)}
                  className='border py-2 px-3 bg-white'
                  type='email'
                  placeholder='Email'
                />
                <input
                  value={subPhone}
                  onChange={(e)=>setSubPhone(e.target.value)}
                  className='border py-2 px-3 bg-white'
                  type='tel'
                  placeholder='WhatsApp number'
                />
                <div className='flex items-center gap-6'>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={channelsEmail} onChange={(e)=>setChannelsEmail(e.target.checked)} />
                    Email
                  </label>
                  <label className='flex items-center gap-2 text-sm'>
                    <input type='checkbox' checked={channelsWhatsapp} onChange={(e)=>setChannelsWhatsapp(e.target.checked)} />
                    WhatsApp
                  </label>
                  <select value={preferredLanguage} onChange={(e)=>setPreferredLanguage(e.target.value)} className='border py-2 px-2 text-sm'>
                    <option value='en'>English</option>
                  </select>
                </div>
                <button
                  onClick={subscribeBackInStock}
                  disabled={submitting}
                  className={`px-6 py-2 text-sm ${submitting ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-black text-white active:bg-gray-700'}`}
                >
                  {submitting ? 'Submitting...' : 'Notify Me'}
                </button>
              </div>
            </div>
          ) : null}
          <hr className='mt-8 sm:w-4/5' />
          {/* <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div> */}
        </div>
      </div>

      {/* ---------- Description & Review Section -------------
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
          <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
        </div>
      </div> */}

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
