
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("./models/Problem");

const app = express();
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({ message: "DSA Problem Management API is running!" });
});

// CREATE a problem
app.post("/api/problems", async (req, res) => {
    try {
        const { title, platform, topic, difficulty, problemLink, solution } = req.body;

        if (
            typeof title !== "string" || !title.trim() ||
            typeof platform !== "string" || !platform.trim() ||
            typeof topic !== "string" || !topic.trim() ||
            !["Easy", "Medium", "Hard"].includes(difficulty)
        ) {
            return res.status(400).json({
                message: "Enter valid title, platform, topic and difficulty."
            });
        }

        const problem = await Problem.create({
            title: title.trim(),
            platform: platform.trim(),
            topic: topic.trim(),
            difficulty,
            problemLink,
            solution
        });

        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ all problems
app.get("/api/problems", async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ one problem by ID
app.get("/api/problems/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid problem ID." });
        }

        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a problem
app.put("/api/problems/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid problem ID." });
        }

        const { title, platform, topic, difficulty, problemLink, solution } = req.body;

        if (
            typeof title !== "string" || !title.trim() ||
            typeof platform !== "string" || !platform.trim() ||
            typeof topic !== "string" || !topic.trim() ||
            !["Easy", "Medium", "Hard"].includes(difficulty)
        ) {
            return res.status(400).json({
                message: "Enter valid title, platform, topic and difficulty."
            });
        }

        const problem = await Problem.findByIdAndUpdate(
            req.params.id,
            {
                title: title.trim(),
                platform: platform.trim(),
                topic: topic.trim(),
                difficulty,
                problemLink,
                solution
            },
            { new: true, runValidators: true }
        );

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a problem
app.delete("/api/problems/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid problem ID." });
        }

        const problem = await Problem.findByIdAndDelete(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json({ message: "Problem deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
