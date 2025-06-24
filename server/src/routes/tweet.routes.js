import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/').get(getTweets)
router.use(verifyJWT); 

router.route("/").post(createTweet);//done
router.route("/:tweetId")
.patch(updateTweet)//done
.delete(deleteTweet);//done

export default router