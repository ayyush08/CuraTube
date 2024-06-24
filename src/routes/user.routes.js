import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js";
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


export default router