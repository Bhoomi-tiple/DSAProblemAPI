
const express = require("express");
require("dotenv").config();

const Problem = require("./models/Problem");
const pool = require("./db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "DSA Problem Management API is running!"
    });
});

// Check for a valid PostgreSQL integer ID
function validId(id) {
    return /^[1-9]\d*$/.test(id) &&
        Number.isSafeInteger(Number(id));
}

// CREATE a problem
app.post("/api/problems", async (req, res) => {
    try {
        const {
            title, platform, topic, difficulty,
            problemLink, solution
        } = req.body;

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
        console.error(error);
        res.status(500).json({ message: "Database operation failed." });
    }
});

// READ all problems
app.get("/api/problems", async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database operation failed." });
    }
});

// READ one problem
app.get("/api/problems/:id", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid problem ID." });
        }

        const problem = await Problem.findById(Number(req.params.id));

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database operation failed." });
    }
});

// UPDATE a problem
app.put("/api/problems/:id", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid problem ID." });
        }

        const {
            title, platform, topic, difficulty,
            problemLink, solution
        } = req.body;

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
            Number(req.params.id),
            {
                title: title.trim(),
                platform: platform.trim(),
                topic: topic.trim(),
                difficulty,
                problemLink,
                solution
            }
        );

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database operation failed." });
    }
});

// DELETE a problem
app.delete("/api/problems/:id", async (req, res) => {
    try {
        if (!validId(req.params.id)) {
            return res.status(400).json({ message: "Invalid problem ID." });
        }

        const problem = await Problem.findByIdAndDelete(
            Number(req.params.id)
        );

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json({
            message: "Problem deleted successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Database operation failed." });
    }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.initializeDatabase();

        // Verify the database connection
        await pool.query("SELECT 1");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
