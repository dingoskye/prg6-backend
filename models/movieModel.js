import mongoose from "mongoose"

const movieModel = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    stars: { type: String, required: true },
    length: { type: Number, required: true },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre"
    }]
})

const Movie = mongoose.model("Movie", movieModel)

export default Movie