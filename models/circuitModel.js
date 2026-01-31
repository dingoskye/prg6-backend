import mongoose from "mongoose"

const circuitModel = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    description: { type: String, required: true},
    favorite: {type: Boolean, required: true, default: false},
},{
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
    )

const Circuit = mongoose.model("circuit", circuitModel)

export default Circuit