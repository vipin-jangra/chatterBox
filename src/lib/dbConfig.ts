import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

type ConnectionObject = {
    isConnected?: number
}

const connectionObj : ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connectionObj.isConnected){
        return;
    }

    try {
        const url = process.env.MONGODB_URI;
        if(!url){
            throw new Error("MongoDB URI is not defined");
        }

        const db = await mongoose.connect(url);
        connectionObj.isConnected = db.connections[0].readyState

        const connection = mongoose.connection;

        connection.on('error',()=>{
            
            process.exit();
        })
        

    } catch (error) {
        process.exit(1);
    }
}

export default dbConnect;