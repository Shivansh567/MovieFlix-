import { styled } from "styled-components";
import MovieComponent from "./componens/MovieComponent";
import MovieInfoComponent from "./componens/MovieInfoComponent";
import { useState, useEffect } from "react";
import axios from "axios";
export const API_KEY = "af14d14c";
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;
function App() {
  const [searchQuery, updateSearchQuery] = useState();
  const [timeoutId, updateTimeoutId] = useState();
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const fetchData = async (searchString) => {
    const response = await axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}`
    );
    console.log(response);
    updateMovieList(response.data.Search);
  };

  const fetchInitialMovies = async () => {
    const categories = [
      "Brahmastra Part One: Shiva",
      "Drishyam",
      "Gangubai Kathiawadi",
      "Animal",
      "Harry Potter",
      "Pirates of the Caribbean",
    ];
    const promises = categories.map((category) =>
      axios.get(`https://www.omdbapi.com/?s=${category}&apikey=${API_KEY}`)
    );
    const results = await Promise.all(promises);
    const allMovies = results.flatMap((result) => result.data.Search);
    updateMovieList(allMovies);
  };

  useEffect(() => {
    fetchInitialMovies();
  }, []);
  const onTextChange = (event) => {
    clearTimeout(timeoutId);
    const query = event.target.value;

    updateSearchQuery(query);
    if (query.trim() === "") {
      fetchInitialMovies();
    } else {
      const timeout = setTimeout(() => fetchData(query), 500);
      updateTimeoutId(timeout);
    }
  };
  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="/movie-icon.svg" />
          React Movie App
        </AppName>
        <SearchBox>
          <SearchIcon src="/search-icon.svg" />
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      {selectedMovie && (
        <MovieInfoComponent
          selectedMovie={selectedMovie}
          onMovieSelect={onMovieSelect}
        />
      )}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="/movie-icon.svg" />
        )}
      </MovieListContainer>
    </Container>
  );
}

export default App;
