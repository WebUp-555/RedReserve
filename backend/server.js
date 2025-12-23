import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './DB/db.js';
dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    try{
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(err){
        console.error('Failed to start server:', err);
    }
})