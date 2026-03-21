import fs from "fs";

const file = "api/routes.ts";
let content = fs.readFileSync(file, "utf-8");

content = content.replace(/res\.status\(500\)\.json\(\{ error: "Database error" \}\);/g, 
    'console.error("Database error:", error);\n        res.status(500).json({ error: "Database error", details: error instanceof Error ? error.message : String(error) });');

fs.writeFileSync(file, content);
console.log("Done");
