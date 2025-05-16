import { Router } from 'express';
import {
    getChannelSubscriberList,
    getSubscribedChannels,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); 

router
    .route("/c/:channelId")
    .get(getChannelSubscriberList)//done
    .post(toggleSubscription);//done

router.route("/channels").get(getSubscribedChannels);//done

export default router