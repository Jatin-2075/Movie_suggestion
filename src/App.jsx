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

  const OMDB_API_KEY = "f8610afc";

  const fetchMovies = (pageNum) => {
    const keyword = moodsChart[input.toLowerCase()];

    if (!keyword) {
      setError("Mood not found in chart. Try one of the suggested moods!");
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError("");

    const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(keyword)}&type=${selectedType}&page=${pageNum}&apikey=${OMDB_API_KEY}`;

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        if (data.Response === "True") {
          setMovies(data.Search);
          setTotalResults(parseInt(data.totalResults) || 0);
        } else {
          setMovies([]);
          setError(data.Error || "No content found for this mood/type combination.");
          setTotalResults(0);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Network error or failed to connect to API.");
        setMovies([]);
        setTotalResults(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (input && selectedType) {
      fetchMovies(page);
    }
  }, [page]);

  const handleSearch = () => {
    if (input && selectedType) {
      setPage(1);
      fetchMovies(1);
    } else {
      setError("Please enter a mood and select a type.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input && selectedType) {
      handleSearch();
    }
  };

  const hasNextPage = totalResults > page * 10;
  const suggestedMoods = Object.keys(moodsChart).slice(0, 5);

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1 className="neon-title">
          <span className="accent-char">M</span>ood <span className="accent-char">M</span>edia <span className="accent-char">F</span>inder
        </h1>
        <p className="subtitle">Discover content based on your current emotional frequency.</p>
      </div>

      <div className="search-controls">
        <div className="input-group">
          <label htmlFor="mood-input" className="input-label">Current Mood:</label>
          <input
            id="mood-input"
            type="text"
            placeholder="e.g., happy, stressed, curious..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="neon-input"
            list="moods"
          />
          <datalist id="moods">
            {suggestedMoods.map(mood => (
              <option key={mood} value={mood} />
            ))}
          </datalist>
        </div>

        <div className="input-group type-select-group">
          <label htmlFor="type-select" className="input-label">Content Type:</label>
          <select
            id="type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="neon-dropdown"
          >
            <option value="" disabled>-- Select Type --</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={!input || !selectedType || loading}
          className={`neon-button ${loading ? 'loading' : ''}`}
        >
          {loading ? "PROCESSING..." : "SEARCH [INIT]"}
        </button>
      </div>

      {error && <div className="feedback-message error-message">{error}</div>}

      <div className="results-container">
        {loading && <p className="feedback-message loading-message">Data Stream Initializing...</p>}

        {movies.length > 0 && !loading ? (
          <div className="movies-grid">
            {movies.map((m) => (
              <div key={m.imdbID} className="movie-card glow-border">
                <div className="poster-wrapper">
                  <img
                    src={m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450/050509/9aa7ad?text=NO+IMAGE+FOUND"}
                    alt={m.Title}
                    className="poster-img"
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <span className="card-type tag-accent">{m.Type}</span>
                  </div>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{m.Title}</h3>
                  <p className="card-year tag-muted">Year: {m.Year}</p>
                  <a
                    href={`https://www.imdb.com/title/${m.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="imdb-link"
                  >
                    View IMDB ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error && (
          <p className="feedback-message no-results-message">
            Enter your mood and content type above to begin the query.
          </p>
        )}
      </div>

      <div className="pagination-controls">
        {movies.length > 0 && (
          <div className="pagination-wrapper">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1 || loading}
              className="pagination-btn prev-btn"
            >
              &lt; PREV PAGE
            </button>
            <span className="page-indicator tag-muted">
              Page **{page}** of {Math.ceil(totalResults / 10)}
              {totalResults > 0 && <span className="total-indicator"> ({totalResults} total)</span>}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage || loading}
              className="pagination-btn next-btn"
            >
              NEXT PAGE &gt;
            </button>
          </div>
        )}
      </div>

      <footer className="footer-bar">
        <p>Mood data mapped to OMDb genres. API Key used: {OMDB_API_KEY}</p>
      </footer>
    </div>
  );
}

export default App;