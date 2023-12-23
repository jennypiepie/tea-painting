import mongoose from "mongoose";
const MONGO_URL = "mongodb+srv://jennypie:zjn20010314@cluster0.vqqlnds.mongodb.net/tea?retryWrites=true&w=majority";
const connection: { isConnected: mongoose.ConnectionStates } = { isConnected: 0 };

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    const db = await mongoose.connect(MONGO_URL);
    connection.isConnected = db.connections[0].readyState;

}

export default dbConnect;