import * as yup from "yup";

const movieSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  plot: yup.string().nullable(),
  poster: yup.string().url("Invalid URL format").nullable(),
  released: yup.date().nullable(),
  lastupdated: yup.date().typeError("Invalid format date"),
});

export default movieSchema;
