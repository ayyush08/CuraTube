import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/user/:userId").get(getUserPlaylists);//done
router.use(verifyJWT); 

router.route("/").post(createPlaylist)//done

router
    .route("/:playlistId")
    .get(getPlaylistById)//done
    .patch(updatePlaylist)//done
    .delete(deletePlaylist);//done

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);//done
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);//done


export default router