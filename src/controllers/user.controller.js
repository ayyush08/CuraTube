import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
//see things after console logging to getaa better understanding


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave:false });

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,'Something went wrong while generating access and refresh tokens')
    }
}



const registerUser = asyncHandler(async (req, res) => {
    // get user data from frontend
    // validation -- not empty
    // check if user already exists: username,email
    // check for images, check for avatar
    // uplaod them to cloudinary, avatar check
    // create user object - create entry in DB
    // remove password and refresh token from response
    // check for user creation
    // return response

    const { fullName, username, email, password } = req.body;
    console.log(email);
    //ek ek krke bhi kr skte check - no issues
    if (
        [fullName, email, username, password].some((field) => !field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    else{
        coverImageLocalPath = null;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User not created");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User created successfully"));
});


const loginUser = asyncHandler(async (req,res)=>{
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookies

    const {email,username,password} = req.body;

    if(!(email || username)){
        throw new ApiError(400,"Email or Username is required");
    }

    const user = await User.findOne({$or:[{email},{username}]})

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password");
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //user to empty h ji refreshtoken me kyuki reference

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { //options for cookies, so that they can be modified only by server
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,
            accessToken,
            refreshToken
        },"User logged in successfully")
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(
        new ApiResponse(200,{},'User logged out successfully')
    )

})

const refreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken; 

    if(!incomingRefreshToken){
        throw new ApiError(401,'Unauthorized request');
    }

    try {
        const decodedToken =  jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN
        )

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401,'Invalid Refresh Token');
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,'Refresh Token is expired or used up');
        }

        const options = {
            httpOnly:true,
            secure:true
        }

        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
        .status(200)
        .cookie('accessToken',accessToken,options)
        .cookie('refreshToken', newRefreshToken,options)
        .json(
            new ApiResponse(
            200,
            { accessToken,newRefreshToken },
            'Access token refreshed :)'
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message ||'Invalid refresh token')
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,'Invalid old password');
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},'Password Updated Successfully'))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,'current user fetched successfully')
})


const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body; //agar files update kra rhe to alag controller rkhe behtar hota h
    if(!fullName || !email){
        throw new ApiError(400,'All fields are required');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName:fullName,
                email:email
            }
        },
        {new:true} //update ke baad ki info return hoti h aise
    ).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200,user,'Account details successfully updated'))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,'Avatar file is missing');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,'Error while uploading on avatar')
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200,user,'Avatar Updated Successfully'))

})
const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,'Cover Image file is missing');
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,'Error while uploading Cover Image')
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select('-password')

    return res
    .status(200)
    .json(new ApiResponse(200,user,'Cover Image Updated Successfully'))

})

export { 
    registerUser, 
    loginUser,
    logoutUser, 
    refreshAccessToken , 
    changeCurrentPassword, 
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage };
