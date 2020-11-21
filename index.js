const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Connect to mongoose
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    ()=>console.log('Connected to db!')
)

// Route Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/user', authRoute); //every route in authRoute will contain the prefix /api/user
app.use('/api/posts', postRoute);

app.listen(process.env.PORT, ()=>console.log("Server successfully started."))