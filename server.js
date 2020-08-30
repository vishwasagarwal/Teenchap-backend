const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//routes 
const blogroute = require('./routes/blog');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');


//app
const app = express();
//db
mongoose
.connect(process.env.DATABASE_LOCAL,{ useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
.then(()=>console.log('DB connected vishwas'));
//middleware
app.use(morgan('dev'));
app.use(bodyparser.json())
app.use(cookieparser())
//cors
if(process.env.NODE_ENV == 'development')
{
    app.use(cors({origin:`${process.env.CLIENT_URL}`}));
}
//route middleware
app.use("/api",blogroute);
app.use('/api',authRoute);
app.use('/api',userRoute);
app.use('/api',categoryRoute);
//routes

const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})