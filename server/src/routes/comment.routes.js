import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();


router.route("/:videoId")
.get(getVideoComments)//done
.post(verifyJWT,addComment);//done

router.use(verifyJWT);

router.route("/c/:commentId")
.delete(deleteComment)//done
.patch(updateComment);//done

export default router