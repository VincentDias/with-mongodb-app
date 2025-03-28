"use client";

import { useEffect, useState } from "react";

interface Movie {
  _id: string;
  title: string;
  poster: string; // URL de l'affiche du film
  year: number;
  director: string;
}

export default function MoviesList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    director: "",
    poster: "",
    year: 0,
  });

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        if (data.status === 200) {
          setMovies(data.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des films:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Fonction pour supprimer un film
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Voulez-vous vraiment supprimer ce film ?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      } else {
        console.error("Erreur lors de la suppression du film");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Fonction pour ajouter un film
  const handleAddMovie = async () => {
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMovie),
      });

      const data = await response.json();
      if (response.ok) {
        setMovies((prevMovies) => [
          ...prevMovies,
          {
            ...newMovie,
            _id: data.data.id,
            year: Number(newMovie.year),
          },
        ]);
        setShowForm(false);
        setNewMovie({ title: "", director: "", poster: "", year: 0 });
      } else {
        console.error("Erreur lors de l'ajout du film:", data.message);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  if (loading) return <p className="text-center">Chargement des films...</p>;

  return (
    <div className="p-4">
      {/* Bouton Ajouter un Film */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mb-4">
        Ajouter un film
      </button>

      {/* Formulaire d'ajout de film */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <input
            type="text"
            placeholder="Titre"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Réalisateur"
            value={newMovie.director}
            onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="URL de l'affiche"
            value={newMovie.poster}
            onChange={(e) => setNewMovie({ ...newMovie, poster: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Année"
            value={newMovie.year}
            onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value ? parseInt(e.target.value, 10) : 0 })}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={handleAddMovie}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
            Enregistrer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold">{movie.title}</h2>
              <p className="text-sm text-gray-600">Réalisé par: {movie.director}</p>
              <p className="text-sm text-gray-500">Année: {movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
