import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router = Router();


router.use(verifyJWT)
router.route("/stats").get(getChannelStats);//done
router.route("/videos").get(getChannelVideos);//done

export default router