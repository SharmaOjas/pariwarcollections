import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import notifyRouter from './routes/notifyRoute.js'

// ===================== APP SETUP =====================
const app = express()
const port = process.env.PORT || 4000

// ===================== DB & SERVICES =================
connectDB()
connectCloudinary()

// ===================== MIDDLEWARE ====================
app.use(express.json())

// ---------- CORS (FIXED & SAFE) ----------
const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, same-origin, Vercel internal calls
    if (!origin) return callback(null, true)

    // Allow localhost (dev)
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true)
    }

    // Allow explicit production origins
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}

app.use(cors(corsOptions))

// ---------- SECURITY HEADERS ----------
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer'
  })

  if (process.env.NODE_ENV === 'production') {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  next()
})

// ===================== ROUTES ========================
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/notify', notifyRouter)

// ===================== HEALTH CHECK ==================
app.get('/', (req, res) => {
  res.send('API Working')
})

// ===================== START SERVER ==================
app.listen(port, () => {
  console.log(`Server started on PORT : ${port}`)
})
