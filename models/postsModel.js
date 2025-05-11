import { Schema, model } from 'mongoose';
import User from './userModel.js';

const postSchema = new Schema({
    // current content
    title: { type: String, required: true }, // title
    describe: { type: String, required: true }, // description
    location: { type: String, required: true }, // location
    images: [{ type: String }], // imgs URL 
    tag: [{ type: String }], // tag

    // creater information
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // original content
    originalContent: {
        title: String,
        describe: String,
        location: String,
        images: [String],
        tag: [String],
        createdAt: { type: Date }
    },

    // editing history
    editHistory: [
        {
            editedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            editedAt: { type: Date, default: Date.now },
            changes: {
                title: String,
                describe: String,
                location: String,
                images: [String],
                tag: [String]
            }
        }
    ],

    // collect and like data
    favoritedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

}, { timestamps: true });

// context searching index
postSchema.index({ title: 'text', describe: 'text', location: 'text' });

// save original content before create
postSchema.pre('save', function (next) {
    if (this.isNew && !this.originalContent) {
        this.originalContent = {
            title: this.title,
            describe: this.describe,
            location: this.location,
            images: this.images,
            tag: this.tag,
            createdAt: this.createdAt || new Date()
        };
    }
    next();
});

const Post = model('Post', postSchema);

export default Post;


