const app = require('./app');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

//handle uncaught exception
process.on('uncaughtException', err => {
    console.log(`error: ${err.message}`);
    console.log(`error: ${err.stack}`);
    console.log('uncaughtException found server down');
    process.exit(1);
})

dotenv.config({path: 'backend/config/config.env'})
//DB CONNECT
connectDatabase();
//cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})    

//HANDLE-UNHANDLE PROMISE REJECTION
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('unhandled promise rejection');
    server.close(() => {
       process.exit(1)
    })
})