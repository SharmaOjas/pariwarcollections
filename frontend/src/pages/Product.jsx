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
              <img className='w-full h-auto' src={image} alt="" />
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
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
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
