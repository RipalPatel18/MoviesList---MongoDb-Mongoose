
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import db from "./components/movies/db.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Express setup 
const app = express();
const port = process.env.PORT || 8888;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//  MongoDB connection
const uri = process.env.MONGO_URI;  
const dbName = process.env.DB_NAME || "moviesdb";

try {
  await mongoose.connect(uri, { dbName });
  console.log("Connected to MongoDB:", dbName);
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1); 
}



// Home page
app.get("/", async (req, res) => {
  let movies = await db.getMovies();
  if (!movies.length) {
    await db.initializeMovies();
    movies = await db.getMovies();
  }
  res.render("index", { movies });
});



// update a movie rating
app.get("/update", async (req, res) => {
  await db.updateMovieRating("The Grand Adventure", "R");
  res.redirect("/");
});

// delete movies by rating
app.get("/delete", async (req, res) => {
  await db.deleteMoviesByRating("R");
  res.redirect("/");
});


// ----- Start server -----
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
