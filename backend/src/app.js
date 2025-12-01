import express from "express";
import cors from "cors";
import jobRouter from "./routes/job.routes.js";
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000","https://job-board-oa.vercel.app/"], // well this is where my frontend runs so , change it if needed
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "12kb" }));
app.use(express.urlencoded({ extended: true, limit: "12kb" }));


// routes
app.get("/",(req,res)=>{
  res.send("successfully connected to job-board-oa server")
});
app.use("/api/v1/jobs", jobRouter);

export default app;
