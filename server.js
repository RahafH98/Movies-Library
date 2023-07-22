"use strict";

const express = require("express");



const cors = require("cors");

const axios = require("axios");

const app = express();

require("dotenv").config();

app.use(cors());


app.get("/", handleHome);

//this for the favorite
app.get("/favorite", favoriteHandeler);


app.get("/trending", (req, res) => {
    axios
      .get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.API_KEY}&language=en-US`
      )
      .then((response) => {
        const trendingMovies = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        }));
  
        res.send(trendingMovies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("There was an error when fetching trending movies.");
    });
});

//create a GET request to search for a movie by name using the Movie DB API
app.get("/search", (req, res) => {
    const searchTerm = req.query.query;
  
    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${searchTerm}&page=1`
      )
      .then((response) => {
        const searchResults = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        }));
  
        res.send(searchResults);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("There was an error during searching for the movie ");
    });
});

//adding 2 routes of your choice from the Movie DB API
//1
app.get("/upcoming", (req, res) => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY}&language=en-US&page=1`
      )
      .then((response) => {
        const upcomingMovies = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        }));
  
        res.send(upcomingMovies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("There was an error when  fetching upcoming movies.");
    });
});

//2

app.get("/popular", (req, res) => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=1`
      )
      .then((response) => {
        const popularMovies = response.data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        }));
  
        res.send(popularMovies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("There was an error when  fetching popular movies.");
      });
});
  

//this to handel the errors 
app.get("*", errorHandeler);




function Movie(title, posterPath, overview) {
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}
  
function handleHome(req, res) {
    const movies = new Movie(
    movieData.title,
    movieData.poster_path,
    movieData.overview
    );
    res.send(movies);
}


function favoriteHandeler(req, res){
    console.log("Welcome to Favorite Page");
    res.send("Welcome to Favorite Page");
}


function errorHandeler(req, res){
    res.send({
    "status": 500,
    "responseText": " something went wrong"
    })
}



// starting the server handler
app.listen(3000, startingLog);

function startingLog(req, res) {
  console.log("Running at 3000");
}