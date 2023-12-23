import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: [true, 'Please provide a name for this pet.'],
        // maxlength: [20, 'Name cannot be more than 60 characters'],
    },
    password: {
        type: String,
    },
})

export default mongoose.models.User || mongoose.model('User', UserSchema, 'users');
