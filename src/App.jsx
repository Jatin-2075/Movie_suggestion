import { useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const moodsChart = {
    sad: "drama",
    demotivated: "sports",
    angry: "slice of life",
    stressed: "animation",
    bored: "thriller",
    lonely: "romance",
    empty: "drama",
    happy: "adventure",
    romantic: "romantic comedy",
    overthinking: "documentary",
    curious: "educational",
    tired: "action",
    excited: "fantasy",
    nostalgic: "classic",
    confused: "mystery",
    adventurous: "exploration",
    playful: "family",
    anxious: "psychological thriller",
    relaxed: "feel-good",
    motivated: "biography",
    hungry: "food & travel",
    hopeful: "uplifting",
    gloomy: "horror",
    energetic: "musical",
    creative: "art & experimental"
  };

  const handleSearch = () => {
    const keyword = moodsChart[input.toLowerCase()];
    if (!keyword) return alert("Mood not found!");

    fetch(`https://www.omdbapi.com/?s=${keyword}&type=${selectedType}&apikey=f8610afc`)
      .then(res => res.json())
      .then(data => {
        if (data.Response === "True") {
          setMovies(data.Search.slice(0, 5));
        } else {
          setMovies([]);
          alert("No results found");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 p-6">
      <h1 className="text-4xl text-white font-bold text-center mb-8 animate-pulse">Mood-Based Movie/Series Finder</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter your mood"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-black"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-300 text-black"
        >
          <option value="">Select type</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.length > 0 ? (
          movies.map((m) => (
            <div
              key={m.imdbID}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-500 hover:scale-105 animate-fadeIn"
            >
              <img
                src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={m.Title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{m.Title}</h3>
                <p className="text-gray-600">Year: {m.Year}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">No results yet</p>
        )}
      </div>
    </div>
  );
}

export default App;
