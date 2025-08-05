import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

router.route("/:videoId")
.get(getVideoComments)//done
.post(addComment);//done


router.route("/c/:commentId")
.delete(deleteComment)//done
.patch(updateComment);//done

export default router