const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// ⚠️ IMPORTANTE: ESTA NO ES UNA API KEY VÁLIDA DE LUAOBFUSCATOR
// Debes poner aquí tu API key REAL del dashboard de LuaObfuscator
const LUAO_API_KEY = process.env.LUAO_KEY || "242e5c8c-421a-a51a-47b1-2cc6aa0e7daa48a3";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/obfuscate", async (req, res) => {
    try {
        const { script } = req.body;

        if (!script || script.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "No script provided"
            });
        }

        const response = await fetch("https://luaobfuscator.com/api/obfuscate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${LUAO_API_KEY}`
            },
            body: JSON.stringify({ script })
        });

        const raw = await response.text();

        // Intentar parsear JSON
        try {
            const json = JSON.parse(raw);
            return res.status(200).json(json);
        } catch (err) {
            console.log("LuaObfuscator devolvió HTML en vez de JSON:");
            console.log(raw);

            return res.status(500).json({
                success: false,
                error: "LuaObfuscator devolvió HTML (API key inválida o request incorrecto)"
            });
        }

    } catch (err) {
        console.error("SERVER ERROR:", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
