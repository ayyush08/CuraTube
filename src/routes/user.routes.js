import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser, logoutUser, registerUser,refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()


router.route('/register').post(
    upload.fields([
        {
            name:'avatar',
            maxCount: 1
        },
        {
            name:'coverImage',
            maxCount: 1
        }
    ]),
    registerUser)


router.route('/login').post(loginUser)

//secured routes
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/refresh-token').post(refreshAccessToken) //verifyjwt ni lgaya kyuki controller me hi decode kr rhe h refrshaccestoken function me
router.route('/change-password').post(verifyJWT, changeCurrentPassword)

router.route('/current-user').get(verifyJWT,getCurrentUser);

router.route('/update-account').patch(verifyJWT,updateAccountDetails) //post rkhne se sari update hojatis
router.route('/avatar').patch(verifyJWT,upload.single('avatar'),updateUserAvatar)


router.route('/cover-image').patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage)

router.route('/channel/:username').get(verifyJWT,getUserChannelProfile)

router.route('/watch-history').get(verifyJWT,getWatchHistory)


export default router