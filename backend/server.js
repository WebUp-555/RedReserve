import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './DB/db.js';

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    try{
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        });
    }
    catch(err){
        console.error('Failed to start server:', err);
    }
})