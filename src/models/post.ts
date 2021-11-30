import mongoose, { Schema, model } from "mongoose";

// An interface that describes the properties
// that are required to create a new Post
interface PostAttrs {
    userid: mongoose.Schema.Types.ObjectId;
    username: string;
    date: Date;
    text: string;
    image: string;
    comments: Array<any>;
    likes?: number;
}

const postSchema = new Schema<PostAttrs>({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    image: { 
        type: String, 
        required: false 
    },

    comments: [{
        required: false,
        date:{
            type: String,
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        text:{
            type: String,
            required: true,
        }
    }],

    likes:{
        type: Number,
        required: true,
    }
});

const Post = model<PostAttrs>('Post', postSchema);
export { Post };