const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// ⚠️ Puedes mover esto a variable de entorno en Render
const LUAO_API_KEY = "242e5c8c-421a-a51a-47b1-2cc6aa0e7daa48a3";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/obfuscate", async (req, res) => {
    try {
        const { script } = req.body;
        if (!script) {
            return res.status(400).json({ success: false, error: "No script provided" });
        }

        const response = await fetch("https://luaobfuscator.com/api/obfuscate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${LUAO_API_KEY}`
            },
            body: JSON.stringify({ script })
        });

        const data = await response.json();
        return res.status(response.ok ? 200 : 500).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
