import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); 

router.route("/toggle/v/:videoId").post(toggleVideoLike);//done
router.route("/toggle/c/:commentId").post(toggleCommentLike);//done
router.route("/toggle/t/:tweetId").post(toggleTweetLike);//done
router.route("/videos").get(getLikedVideos);//done

export default router