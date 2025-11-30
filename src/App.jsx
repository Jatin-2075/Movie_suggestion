import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  const moodsChart = {
    sad: "drama", demotivated: "sports", angry: "slice of life", stressed: "animation",
    bored: "thriller", lonely: "romance", empty: "drama", happy: "adventure",
    romantic: "romantic comedy", overthinking: "documentary", curious: "educational",
    tired: "action", excited: "fantasy", nostalgic: "classic", confused: "mystery",
    adventurous: "exploration", playful: "family", anxious: "psychological thriller",
    relaxed: "feel-good", motivated: "biography", hungry: "food & travel",
    hopeful: "uplifting", gloomy: "horror", energetic: "musical",
    creative: "art & experimental"
  };

  const fetchMovies = (pageNum) => {
    const keyword = moodsChart[input.toLowerCase()];
    if (!keyword) {
      setError("Mood not found!");
      return;
    }

    setLoading(true);
    setError("");
    fetch(`https://www.omdbapi.com/?s=${keyword}&type=${selectedType}&page=${pageNum}&apikey=f8610afc`)
      .then(res => res.json())
      .then(data => {
        if (data.Response === "True") {
          setMovies(data.Search);
          setTotalResults(parseInt(data.totalResults) || 0);
        } else {
          setMovies([]);
          setError(data.Error || "No results found");
        }
      })
      .catch(() => {
        setError("Failed to fetch data. Try again!");
        setMovies([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (input && selectedType) {
      fetchMovies(page);
    }
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchMovies(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input && selectedType) {
      handleSearch();
    }
  };

  const hasNextPage = totalResults > page * 10;
  const suggestedMoods = Object.keys(moodsChart).slice(0, 5);

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">🎬 Mood-Based Movie/Series Finder</h1>
        <p className="subtitle">Discover content based on your current mood</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter your mood (e.g., sad, happy, stressed)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-box"
          list="moods"
        />
        <datalist id="moods">
          {suggestedMoods.map(mood => (
            <option key={mood} value={mood} />
          ))}
        </datalist>

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
          onClick={handleSearch}
          disabled={!input || !selectedType || loading}
          className="search-btn"
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map((m) => (
              <div key={m.imdbID} className="card">
                <div className="poster-container">
                  <img
                    src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
                    alt={m.Title}
                    className="poster"
                  />
                  <div className="overlay">
                    <span className="type">{m.Type}</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{m.Title}</h3>
                  <p className="card-text">📅 {m.Year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No results yet. Try a mood!</p>
        )}
      </div>

      <div className="pagination">
        {movies.length > 0 && (
          <div className="pagination-controls">
            <button 
              onClick={() => setPage(p => p - 1)} 
              disabled={page === 1}
              className="prev-btn"
            >
              ← Previous
            </button>
            <span className="page-indicator">Page {page} / {Math.ceil(totalResults / 10)}</span>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={!hasNextPage}
              className="next-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
