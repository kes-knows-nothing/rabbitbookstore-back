import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true,}, 
    phone: { type: Number, required: true, }, 
    address: {type: String, required: true,},
});

userSchema.pre('save', async function() {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
})

const User = mongoose.model("User", userSchema);
export default User;