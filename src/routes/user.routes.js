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
    registerUser)//done


router.route('/login').post(loginUser)//done

//secured routes
router.route('/logout').post(verifyJWT, logoutUser)//done
router.route('/refresh-token').post(refreshAccessToken) ////done
router.route('/change-password').post(verifyJWT, changeCurrentPassword)//done

router.route('/current-user').get(verifyJWT,getCurrentUser);//done

router.route('/update-account').patch(verifyJWT,updateAccountDetails)//done, 
router.route('/avatar').patch(verifyJWT,upload.single('avatar'),updateUserAvatar)//done


router.route('/cover-image').patch(verifyJWT,upload.single('coverImage'),updateUserCoverImage)//done

router.route('/channel/:username').get(verifyJWT,getUserChannelProfile)//done

router.route('/watch-history').get(verifyJWT,getWatchHistory)//done


export default router