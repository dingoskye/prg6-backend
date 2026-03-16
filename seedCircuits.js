import mongoose from "mongoose"
import fs from "fs"
import Circuit from "./models/circuitModel.js"

try {

    // connect to database
    await mongoose.connect(process.env.MONGODB_URI)

    console.log("Connected to database")

    // read JSON file
    const data = JSON.parse(
        fs.readFileSync("./circuits.json", "utf-8")
    )

    // clear old data (optional)
    await Circuit.deleteMany({})

    // insert new circuits
    await Circuit.insertMany(data)

    console.log("Circuits imported successfully")

    process.exit()

} catch (e) {

    console.error("Import failed:", e.message)

    process.exit(1)

}