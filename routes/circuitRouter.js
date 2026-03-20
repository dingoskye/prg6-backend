import express from "express"
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

        const items = circuits.map(circuit => ({
            name: circuit.name,
            owner: circuit.owner,
            country: circuit.country,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}/${circuit._id}`
                }
            }
        }))

        const collection = {
            items,
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
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const circuit = await Circuit.findById(id);

        if (!circuit) {
            return res.status(404).json({ message: "Circuit not found" });
        }

        res.status(200).json(circuit);
    } catch (e) {
        res.status(404).json({ message: "Circuit not found" });
    }
})

router.post("/", async (req, res) => {

    try {
        // if (Array.isArray(req.body)) {
        //     const circuits = await Circuit.insertMany(req.body)
        //     return res.status(201).json(circuits)
        // }

        const circuit = new Circuit({
            name: req.body.name,
            owner: req.body.owner,
            description: req.body.description,
            opened_year: req.body.opened_year,
            capacity: req.body.capacity,
            country: req.body.country,
            city: req.body.city,
            favorite: req.body.favorite ?? false
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
        circuit.favorite = req.body.favorite ?? circuit.favorite

        const succes = await circuit.save()
        res.status(200).json(succes)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.patch("/:id", async (req, res) => {
    const id = req.params.id

    if (req.body?.name || req.body?.owner || req.body?.description || req.body?.opened_year || req.body?.capacity || req.body.country || req.body.city ||req.body?.favorite) {
    try {
        const circuit = await Circuit.findById(id)

        if (!circuit) {
            return res.status(404).json({ message: "Not found" })
        }

        if (req.body.name) {
            circuit.name = req.body.name
        }

        if (req.body.owner) {
            circuit.owner = req.body.owner
        }

        if (req.body.description) {
            circuit.description = req.body.description
        }

        if (req.body.opened_year) {
            circuit.opened_year = req.body.opened_year
        }

        if (req.body.capacity) {
            circuit.capacity = req.body.capacity
        }

        if (req.body.country) {
            circuit.country = req.body.country
        }

        if (req.body.city) {
            circuit.city = req.body.city
        }

        if (req.body.favorite !== undefined) {
            circuit.favorite = !circuit.favorite
        }

        const success = await circuit.save()
        res.status(200).json(success)

    } catch (e) {
        res.status(400).json({ message: e.message })
    }} else {
    res.status(400).json({message: "Body is empty"})
}
})
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const circuit = await Circuit.findById(id);

        if (!circuit) {
            return res.status(404).json({ message: "Circuit not found" });
        }

        await circuit.deleteOne();
        res.status(204).send();
    } catch (e) {
        res.status(400).json({ message: e.message });
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

