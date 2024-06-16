import mongoose,{ Schema } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
        index: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true,
    },
    fullName:{
        type:String,
        required:true,
        trim: true,
        index:true
    },
    avatar:{
        type:String, //cloudnary url
        required:true,

    },
    coverImage:{
        type:String, //cloudnary url

    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type: String, //challenge
        required: [true,"Password is required"]
    },
    refreshToken:{
        type: String
    }
},{
    timestamps:true
})

userSchema.pre('save', async function(next){ //arrow callback not given because it don't have 'this' reference (no context)
    if(!this.isModified('password')){ // encryptin ONLY WHEN password is modified
        return next()
    }
    this.password = bcrypt.hash(this.password,8)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password) //returns true/false
} 


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username: this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.ACCESS_REFRESH_SECRET,
        {
            expiresIn: process.env.ACCESS_REFRESH_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);