import "./App.css";
import { useState, useEffect } from "react";
import { genres, tooltips } from "./data/genres";
import { btnsBackground } from "./data/colors";
import Loader from "react-loader-spinner";

function App() {
  const [checks, setChecks] = useState([]);
  const [randomMovie, setRandomMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const btns = Object.keys(genres);

  async function onSubmit(e) {
    e.preventDefault();
    if (checks.length === 0) {
      console.log(btns);
      return;
    }
    setLoading(true);
    let chosen = [];
    for (let key of checks) {
      if (key in genres) {
        chosen.push(...genres[key]);
      }
    }
    chosen = chosen.filter(Boolean);
    let title = chosen[Math.floor(Math.random() * chosen.length)];
    const regex = /[+()\d-]+/;
    const year = title.match(regex);
    if (year && year[0]) {
      let movieTitle = title.match(/[a-zA-Z]+/g).join("+");
      await fetch(
        `https://www.omdbapi.com/?t=${movieTitle}&y=${year[0].slice(
          1,
          year[0].length - 1
        )}&apikey=${process.env.REACT_APP_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => setRandomMovie(data));
      setLoading(false);
      setTimeout(() => setLoading(false), 400);
    } else {
      if (!title) return;
      title = title.split(" ").join("+");
      await fetch(
        `https://www.omdbapi.com/?t=${title}&apikey=${process.env.REACT_APP_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => setRandomMovie(data));
      setTimeout(() => setLoading(false), 400);
    }
  }
  return (
    <>
      <form onSubmit={onSubmit} id="form">
        <div className="buttons-container">
          {btns.map((btn) => {
            return (
              <label
                key={btn}
                className="checkbox"
                style={{
                  background: btnsBackground[3],
                }}
              >
                {btn}{" "}
                <input
                  type="checkbox"
                  name={btn}
                  value={btn}
                  onChange={() =>
                    checks.includes(btn)
                      ? setChecks(checks.filter((button) => button !== btn))
                      : setChecks([...checks, btn])
                  }
                />{" "}
                <span className="tooltip-text">{tooltips[btn]}</span>
              </label>
            );
          })}{" "}
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      <div className="container">
        <div>
          {loading && (
            <Loader
              type="Audio"
              color={btnsBackground[6]}
              height={150}
              width={150}
              timeout={3000} //3 secs
              className="random-movie"
              style={{ marginTop: "60px" }}
            />
          )}
          {!loading && Object.keys(randomMovie).length > 0 && (
            <div className="random-movie">
              <h3>
                {randomMovie.Title} ({randomMovie.Year})
              </h3>
              <p className="rated">
                {" "}
                Rated:
                {randomMovie.Rated === "NC-17" || randomMovie.Rated === "R"
                  ? "  Movie contains a lot of sex, violence or gore scenes"
                  : "  Movie is without exaggerated violence and sex scenes"}
              </p>
              <p>
                According to number of votes on imdb movie is{" "}
                <small>
                  <strong>
                    {randomMovie?.imdbVotes?.split(",").join("") > 100000
                      ? "pretty popular"
                      : "little bit uknown"}
                  </strong>
                </small>
              </p>
              <img src={randomMovie.Poster} alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
