import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);

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

    fetch(`https://www.omdbapi.com/?s=${keyword}&type=${selectedType}&page=${page}&apikey=f8610afc`)
      .then(res => res.json())
      .then(data => {
        if (data.Response === "True") {
          setMovies(data.Search);
        } else {
          setMovies([]);
          alert("No results found");
        }
      })
      .catch(err => console.log(err));
  };

  // Run search whenever page changes (but only if we already have input & type)
  useEffect(() => {
    if (input && selectedType) {
      handleSearch();
    }
  }, [page]);

  const handleNext = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="app">
      <h1 className="title">Mood-Based Movie/Series Finder</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter your mood"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-box"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="dropdown"
        >
          <option value="">Select type</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>

        <button
          onClick={() => {
            setPage(1); // reset to first page
            handleSearch();
          }}
          className="search-btn"
        >
          Search
        </button>
      </div>

      <div className="results">
        {movies.length > 0 ? (
          movies.map((m) => (
            <div key={m.imdbID} className="card">
              <img
                src={
                  m.Poster !== "N/A"
                    ? m.Poster
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={m.Title}
                className="poster"
              />
              <div className="card-body">
                <h3 className="card-title">{m.Title}</h3>
                <p className="card-text">Year: {m.Year}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No results yet</p>
        )}
      </div>

      <div className="pagination">
        {movies.length > 0 && (
          <button onClick={handleNext} className="next-btn">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
