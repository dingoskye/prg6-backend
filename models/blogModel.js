import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
        title: {type: String, required: true},
        circuit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Circuit",
            required: true
        },
        author: {type: String, required: true},
        favorite: {type: Boolean, required: true, default: false},
        blog: {type: String, required: true},
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.BASE_URI}/${ret._id}`,
                    },
                    collection: {
                        href: `${process.env.BASE_URI}`,
                    }
                };

                delete ret._id;
            },
        },
    }
);

const Blog = mongoose.model("blog", blogSchema);

export default Blog;