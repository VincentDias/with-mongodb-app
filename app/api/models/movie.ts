import mongoose, { Schema } from "mongoose";

const movieModel = new Schema({
  title: String,
  plot: String,
  poster: String,
  released: Date,
  lastupdated: Date,
});

export const Movie = mongoose.model("Movie", movieModel);

export default Movie;
