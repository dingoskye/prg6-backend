import express from "express"
import {fakerNL} from "@faker-js/faker"
import Circuit from "../models/circuitModel.js";

const router = express.Router()

router.use((req, res, next) => {
    const headers = req.headers["accept"]
    const method = req.method

    if ((headers && headers.includes("application/json")) || method === "OPTIONS") {
        next()
    } else {
        res.status(406).json({ message: "Webservice only supports JSON." })
    }
})

router.get("/", async (req, res) => {
    try {
        const circuits = await Circuit.find({})

        const collection = {
            items: circuits,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}/circuits`
                },
                collection: {
                    href: `${process.env.BASE_URI}/circuits`
                }
            }
        }

        res.status(200).json(collection)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const circuit = await Circuit.findById(id)
        res.status(200).json(circuit)
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.post("/", async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const circuits = await Circuit.insertMany(req.body)
            return res.status(201).json(circuits)
        }

        const circuit = new Circuit({
            name: req.body.name,
            owner: req.body.owner,
            description: req.body.description,
            opened_year: req.body.opened_year,
            capacity: req.body.capacity,
            country: req.body.country,
            city: req.body.city,
            length_km: req.body.length_km,
            number_of_turns: req.body.number_of_turns,
            track_type: req.body.track_type,
            direction: req.body.direction,
            lap_record: req.body.lap_record,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            fia_grade: req.body.fia_grade,
            favorite: req.body.favorite
        })

        await circuit.save()
        res.status(201).json(circuit)
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
})

router.put("/:id", async (req, res) => {
    const id = req.params.id

    try {
        const circuit = await Circuit.findById(id)

        if (!circuit) {
            return res.status(404).json({ message: "Circuit not found" })
        }
        circuit.name = req.body.name
        circuit.owner = req.body.owner
        circuit.description = req.body.description
        circuit.opened_year = req.body.opened_year
        circuit.capacity = req.body.capacity
        circuit.country = req.body.country
        circuit.city = req.body.city
        circuit.length_km = req.body.length_km
        circuit.number_of_turns = req.body.number_of_turns
        circuit.track_type = req.body.track_type
        circuit.direction = req.body.direction
        circuit.lap_record = req.body.lap_record
        circuit.latitude = req.body.latitude
        circuit.longitude = req.body.longitude
        circuit.fia_grade = req.body.fia_grade
        circuit.favorite = req.body.favorite

        const succes = await circuit.save()
        res.status(200).json(succes)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.delete("/:id", async (req, res) => {
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

// router.post("/circuits/seed", async (req, res) => {
//     const reset = req.body.reset
//     if (reset === "true") {
//         await Circuit.deleteMany({})
//     }
//
//     const amount = 10
//     const circuits = []
//
//     for (let i = 0; i < amount; i++) {
//         const circuit = Circuit({
//             name: fakerNL.book.title(),
//             owner: fakerNL.person.fullName(),
//             description: fakerNL.lorem.paragraph(),
//             favorite: fakerNL.datatype.boolean(),
//         })
//         circuit.save()
//         circuits.push(circuit)
//     }
//
//     res.status(201).send(circuits)
// })
//
// router.post("/seed", async (req, res, next) => {
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

export default router

