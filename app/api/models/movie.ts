import mongoose, { Schema } from "mongoose";

interface IMovie extends Document {
  title: string;
  plot: string;
  poster: string;
  released: Date;
  lastupdated: Date;
}

const movieModel = new Schema<IMovie>({
  title: String,
  plot: String,
  poster: String,
  released: Date,
  lastupdated: Date,
});

const Movie = mongoose.models.movie || mongoose.model("movies", movieModel);

export default Movie;
