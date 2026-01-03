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

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
const isAllowedOrigin = (origin) => {
    if (!origin) return true
    if (origin === 'null' && process.env.NODE_ENV !== 'production') return true
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true
    if (allowedOrigins.includes(origin)) return true
    return false
}
const corsOptions = {
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) return callback(null, true)
        return callback(null, false)
    },
    credentials: true,
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','token'],
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use((req,res,next)=>{
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

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/notify',notifyRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))
