import { Inngest } from 'inngest'
import { ApiError } from '../utils/ApiError.js';


const INNGEST_EVENT_KEY = process.env.INNGEST_EVENT_KEY;

if (!INNGEST_EVENT_KEY) {
    throw new ApiError("INNGEST_EVENT_KEY is not set in the environment variables");
}

export const inngest = new Inngest({
    id: 'curatube-video-transcoder',
    eventKey: INNGEST_EVENT_KEY,
})