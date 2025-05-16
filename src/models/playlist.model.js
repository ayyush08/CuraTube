import mongoose,{Schema} from "mongoose";



const playlistSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        videos:[
            {
            video: {
                type: Schema.Types.ObjectId,
                ref: "Video"
            },
            addedAt: {
                type: Date,
                default: Date.now  
            }
        }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    },
    {
        timestamps:true
    }
)

export const Playlist = mongoose.model('Playlist',playlistSchema)