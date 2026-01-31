import express from "express"
import {fakerNL} from "@faker-js/faker";
import Circuit from "../models/circuitModel.js";

const circuitRouter = express.Router()

circuitRouter.use((req, res, next) => {
    const headers = req.headers["accept"]
    const method = req.method

    if ((headers && headers.includes("application/json")) || method === "OPTIONS") {
        next()
    } else {
        res.status(406).json({ message: "Webservice only supports JSON." })
    }
})

circuitRouter.get("/", async (req, res) => {
    const circuits = await Circuit.find({})
    const collection = {
        items: circuits,
        _links: {
            self: {
                href: `${process.env.BASE_URI}`
            },
            collection: {
                href: `${process.env.BASE_URI}`
            }
        }
    }

    res.status(200).json(collection)
})

circuitRouter.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const circuit = await Circuit.findById(id)
        res.status(200).json(circuit)
    } catch (e) {
        res.status(404).send(e.message)
    }
})

circuitRouter.post("/", async (req, res) => {
    try {
        const circuit = new Circuit({
            name: req.body.name,
            owner: req.body.owner,
            opening: req.body.opening,
            description: req.body.description,
        })

        await circuit.save()
        res.status(201).json(circuit)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

circuitRouter.put("/:id", async (req, res) => {
    const id = req.params.id

    try {
        const circuit = await Circuit.findById(id)

        if (!circuit) {
            return res.status(404).json({ message: "Circuit not found" })
        }

            circuit.name = req.body.name
            circuit.owner = req.body.owner
            circuit.opening = req.body.opening
            circuit.description = req.body.description

        const succes = await circuit.save()
        res.status(200).json(succes)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

circuitRouter.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const circuit = await Circuit.findById(id)

        if (!circuit) {
            return res.status(404).json({ message: "Circuit not found" })
        }

        await circuit.deleteOne()
        res.status(204).send()
    } catch (e) {
        res.status(400).send(e.message)
    }
})

circuitRouter.post("/circuits/seed", async (req, res) => {
    const reset = req.body.reset
    if (reset === "true") {
        await Circuit.deleteMany({})
    }

    const amount = 10
    const circuits = []

    for (let i = 0; i < amount; i++) {
        const circuit = Circuit({
            name: fakerNL.book.title(),
            owner: fakerNL.person.fullName(),
            description: fakerNL.lorem.paragraph(),
            favorite: fakerNL.datatype.boolean(),
        })
        circuit.save()
        circuits.push(circuit)
    }

    res.status(201).send(circuits)
})
//
// circuitRouter.post("/seed", async (req, res, next) => {
//     if (req.body?.method && req.body.method === "SEED") {
//
//         const reset = req.body?.reset ?? false
//         if (reset && reset === "true") {
//             await Circuit.deleteMany({})
//         }
//
//         const amount = req.body?.amount ?? 10
//         const circuits = []
//
//         for (let i = 0; i < amount; i++) {
//
//             const circuit = Circuit({
//                 name: fakerNL.book.title(),
//             owner: fakerNL.person.fullName(),
//             description: fakerNL.lorem.paragraph(),
//             favorite: fakerNL.datatype.boolean(),
//             })
//             await circuit.save()
//             circuits.push(circuit)
//         }
//         res.status(201).json(circuits)
//
//     } else {
//         next()
//     }
// })

circuitRouter.options("/", (req, res) => {
    res.header("Allow", "GET, POST, OPTIONS").status(204).send()
})

circuitRouter.options("/:id", (req, res) => {
    res.header("Allow", "GET, PUT, DELETE, OPTIONS").status(204).send()
})

export default circuitRouter