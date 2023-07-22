"use strict";

const express = require("express");

const movieData = require("./MovieData/data.json");
const cors = require("cors");

const axios = require("axios");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", handleHome);

const DB_URL = process.env.DATABASE_URL;
const dbClient = new pg.Client(DB_URL);

app.post("/addMovie", (req, res)=>{
  let title = req.body.t;
  let year = req.body.y;
  let comments = req.body.c;

  let sql = `insert into movies(title, year, comments) values($1,$2,$3)`;
  dbClient.query(sql,[title,year,comments]).then(()=>{
    res.status(201).send(`movie ${title} added to the database`)
  })

});


app.get("/getMovies", (req, res)=>{
  let sql = `SELECT * FROM movies`;
  dbClient.query(sql).then((movieD)=>{
    res.status(200).send(movieD.rows)
  });
});


dbClient.connect().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Listening at ${PORT}`)
  })
});

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
  
app.put("/updateMovie/:id", (req, res) => {
  let { id } = req.params;
  let { newComment } = req.body;
  let sql = `UPDATE movies SET comments = '${newComment}' WHERE id = ${id}`;
  dbClient.query(sql)
    .then((data) => {
      res.status(200).send(`Updated`);
    });
});



app.delete("/deleteMovie/:id", async (req, res) => {
  let {id} = req.params;
  let sql = `DELETE FROM movies WHERE id = ${id}`;
  await dbClient.query(sql);
  res.status(200).send('deleted from the database');
});

app.get("/getMoviesById/:id", (req, res)=>{
  let {id} = req.params;
  let sql = `SELECT * FROM movies WHERE id=${id}`;
  dbClient.query(sql)
  .then((data) => res.status(200).send(data.rows));
});









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




app.listen(3000, startingLog);

function startingLog(req, res) {
  console.log("Running at 3000");
}