import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if (!token_decode || token_decode.role !== 'admin') {
            return res.status(401).json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' })
        }
        res.status(401).json({ success: false, message: error.message })
    }
}

export default adminAuth
