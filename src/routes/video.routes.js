import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router
    .route("/")
    .get(getAllVideos)//done
    .post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        publishAVideo //done
    );

router
    .route("/:videoId")
    .get(getVideoById)//half done - add pipelines to get additonal details of the video, and add published/unpublished checks based on user/guest
    .delete(verifyJWT, deleteVideo)//done
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo);//done

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);//done

export default router