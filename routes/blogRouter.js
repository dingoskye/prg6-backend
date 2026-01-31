import express from "express"
import {fakerNL} from "@faker-js/faker"
import Blog from "../models/blogModel.js"
import Circuit from "../models/circuitModel.js";
import mongoose from "mongoose";

const router = express.Router()



//delete route
router.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const circuit = await Blog.findById(id)
        if (!circuit) {
            res.status(404).json({message: "Not found"})
        }

        await circuit.deleteOne()
        res.status(204).send()
    } catch (e) {
        res.status(404).json({message: "Not found"})
    }
})

//options routes
router.options("/", (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept")
    res.header("Allow", "GET, POST, OPTIONS").status(204).send()
})

router.options("/:id", (req, res) => {
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept")
    res.header("Allow", "GET, PUT, PATCH, DELETE, OPTIONS").status(204).send()
})

export default router