import mongoose from "mongoose";




const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: String, required: true }
});





const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);


async function initializeMovies() {
  const count = await Movie.countDocuments();
  if (count === 0) {
    await Movie.insertMany([
      { title: "The Grand Adventure", year: 2018, rating: "PG" },
      { title: "City of Code", year: 2021, rating: "G" },
      { title: "Nightfall", year: 2015, rating: "R" },


    ]);


    console.log("Inserted initial movies.");
  }
}



// Get all movies
async function getMovies() {
  return await Movie.find().lean().sort({ title: 1 });
}

// Update rating by title
async function updateMovieRating(title, newRating) {
  return await Movie.updateOne(
    { title },
    { $set: { rating: newRating } }
  );
}


// Delete movies by rating
async function deleteMoviesByRating(rating) {
  return await Movie.deleteMany({ rating });
}

export default {
  initializeMovies,
  getMovies,
  updateMovieRating,
  deleteMoviesByRating
};
