import mongoose from "mongoose"

const circuitModel = new mongoose.Schema({
        name: { type: String, required: true },
        owner: { type: String, required: true },
        description: { type: String, required: true },
        opened_year: { type: Number, required: true },
        capacity: { type: Number, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },

        length_km: { type: Number, required: true },
        number_of_turns: { type: Number, required: true },
        track_type: { type: String, required: true },
        direction: { type: String, enum: ["clockwise", "counter-clockwise"], required: false },
        lap_record: { type: String, required: false },

        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },

        fia_grade: { type: String, enum: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"], required: false},
        image_url: { type: String, required: false },
        favorite: { type: Boolean, required: true, default: false },

},{
        toJSON: {
            timestamps: true,
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