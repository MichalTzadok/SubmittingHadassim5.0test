import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import supplierRoute from './routes/supplierAuthRoutes.js'
import productRoute from './routes/productRoutes.js'
import orderRoute from './routes/orderRoutes.js'
import ownerRoute from './routes/ownerRoutes.js'
import stockRoute from './routes/stockRoutes.js'


dotenv.config(); 

const app = express()

app.use(cors())

app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `)
})

mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log("🚀 Successfully connected")
})
.catch((err) => {
    console.log(err.message)
})

app.use('/suppliers', supplierRoute);
app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/owner', ownerRoute);
app.use('/stocks', stockRoute);
