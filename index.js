import express from 'express';
import mongoose from "mongoose";
const app = express();
import router from "./routes/blogRouter.js"
import circuitRouter from "./routes/circuitRouter.js";

// const PORT = process.env.PORT || 8000;

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
//
// app.listen(PORT, () => {
//     console.log(`Server draait op poort ${PORT}`);
// });

try {
    await mongoose.connect(process.env.MONGODB_URI)

    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`)
    })

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    //middleware
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

    app.use("/circuits", circuitRouter)
    app.use("/blogs", router)

} catch (e) {
    console.log("Database connection failed")
}
