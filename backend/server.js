import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import prescriptionRouter from './routes/prescriptionRoute.js'
import walletRouter from './routes/walletRoute.js'
import reviewRouter from './routes/reviewRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000

// Connect to database
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)
app.use('/api/prescription', prescriptionRouter)
app.use('/api/wallet', walletRouter)
app.use('/api/review', reviewRouter)

app.get("/", (req, res) => {
  res.send("MediSync API Working")
})

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState
  if (state === 1) {
    res.json({ success: true, message: 'Database connected', status: 'healthy' })
  } else {
    res.status(500).json({ success: false, message: 'Database not connected' })
  }
})

app.listen(port, () => console.log(`Server started on PORT:${port}`))
