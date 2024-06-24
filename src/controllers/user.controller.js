import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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



export { registerUser, loginUser,logoutUser };
