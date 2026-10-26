
const pool = require("../db");

const Problem = {
    async create(data) {
        const query = `
            INSERT INTO problems
            (title, platform, topic, difficulty, "problemLink", solution)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            data.title,
            data.platform,
            data.topic,
            data.difficulty,
            data.problemLink || "",
            data.solution || ""
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async find() {
        const result = await pool.query(
            "SELECT * FROM problems ORDER BY id ASC"
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            "SELECT * FROM problems WHERE id = $1",
            [id]
        );
        return result.rows[0] || null;
    },

    async findByIdAndUpdate(id, data) {
        const query = `
            UPDATE problems
            SET title = $1,
                platform = $2,
                topic = $3,
                difficulty = $4,
                "problemLink" = $5,
                solution = $6,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `;

        const values = [
            data.title,
            data.platform,
            data.topic,
            data.difficulty,
            data.problemLink || "",
            data.solution || "",
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0] || null;
    },

    async findByIdAndDelete(id) {
        const result = await pool.query(
            "DELETE FROM problems WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0] || null;
    }
};

module.exports = Problem;
