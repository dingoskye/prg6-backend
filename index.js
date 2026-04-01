import express from 'express';
import mongoose from "mongoose";
const app = express();
import cors from "cors";
import router from "./routes/circuitRouter.js";

try {
    await mongoose.connect(process.env.MONGODB_URI)

    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`)
    })

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/", (req, res, next) => {
        const headers = req.headers["accept"]
        const method = req.method

        res.header("Access-Control-Allow-Origin", '*')

        if (method === "OPTIONS") {
            next()
        } else if (headers && headers.includes("application/json")) {
            next()
        } else {
            res.status(406).json({message: "Webservice only supports json."})
        }
    })

    app.use("/circuits", router)

} catch (e) {
    console.log("Database connection failed")
}


// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

