import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { exec } from "child_process";
import { initDb } from "./db.js";
import { apiRouter } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function startServer() {
    await initDb();

    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use(express.json());

    app.get("/api/status", (req, res) => {
        res.json({ status: "online", version: "1.0.1", server: "Synology-NAS" });
    });

    // Admin Endpoint: Git Pull & Restart (Vereinfacht für den Browser)
    app.get("/api/admin/git-pull", (req, res) => {
        const adminSecret = process.env.ADMIN_SECRET;
        
        // Wenn ein Secret in der .env definiert ist, prüfe es über die URL!
        if (adminSecret) {
            const providedSecret = req.query.secret;
            if (providedSecret !== adminSecret) {
                console.warn("Unautorisierter Versuch, ein Update durchzuführen!");
                return res.status(401).send("<h1>Fehler: Falsches oder fehlendes Passwort in der URL.</h1>");
            }
        }

        console.log("Führe 'git pull origin main' aus...");
        exec("git pull origin main", (error, stdout, stderr) => {
            if (error) {
                console.error(`Git pull Fehler: ${error.message}`);
                return res.status(500).send(`<h1>Fehler beim Update</h1><pre>${error.message}</pre>`);
            }
            
            console.log(`Git pull erfolgreich:\n${stdout}`);
            res.send(`<h1>Update erfolgreich!</h1><p>Server startet neu...</p><pre>${stdout}</pre>`);

            // Server nach 1 Sekunde beenden
            setTimeout(() => {
                console.log("Beende Prozess für Neustart...");
                process.exit(1);
            }, 1000);
        });
    });

    app.use("/api", apiRouter);
    app.use(express.static(path.join(rootDir, "public")));

    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
            root: rootDir
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.join(rootDir, "dist")));
        app.get("*", (req, res) => {
            res.sendFile(path.join(rootDir, "dist", "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

    // Global Error Handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error("Unhandled Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
    });
}

startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
