const express = require ('express')
const mongoose = require ('mongoose')
const cifarImageRoutes = require('./routes/cifarImageRoute');
const authRoutes = require('./routes/authRoute');
const app = express()
const cors = require('cors');






app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);  // Echo back the Origin header
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


app.use(express.json());
require('dotenv').config(); 



const PORT = process.env.PORT || 3000;
console.log("connecting to" +process.env.MONGODB_URI );
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});


app.get('/sample', (req, res) => {
    const content = 'api is working';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'inline');
    res.send(content);
  
  });



app.use('/api', cifarImageRoutes);
app.use('/auth', authRoutes);



app.listen(PORT,()=>{
    console.log("Server Online")
})