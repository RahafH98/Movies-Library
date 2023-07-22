"use strict";
const express = require("express");
const client = require("../client");
const Router = express.Router();
const axios = require("axios");


Router.get("/", handleHome);


Router.get("/", async (req, res, next)=>{
  try{
    console.log(req.method, req.url);
    let sql = "SELECT * FROM movies";

    let response = await client.query(sql);
    res.status(200).send(res.rows);
    
  } catch (e){
    next(`gelMovies handler: ${e}`);
  }
});


Router.post("/", (req, res, next)=>{
  try{

  let title = req.body.t;
  let year = req.body.y;
  let comments = req.body.c;

 
  let sql = `insert into movies(title, year, comments) values($1,$2,$3)`;
  client.query(sql,[title,year,comments]).then(()=>{
    res.status(201).send(`movie ${title} added to the database`)
  })
  } catch (e){
    next.apply(`addMovies handler: ${e}`);
  }
});



Router.get("/favorite", favoriteHandeler);


Router.get("/trending", (req, res) => {
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
        res.status(500).send("An error occurred while fetching trending movies.");
    });
});


Router.get("/search", (req, res) => {
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
        res.status(500).send("An error occurred while searching for movies.");
    });
});


Router.get("/upcoming", (req, res) => {
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
        res.status(500).send("An error occurred while fetching upcoming movies.");
    });
});

//2

Router.get("/popular", (req, res) => {
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
  


Router.put("/:id", (req, res, next) => {

    try{
        let { id } = req.params;
        let { newComment } = req.body;
        let sql = `UPDATE movies SET comments = '${newComment}' WHERE id = ${id}`;
        client.query(sql).then((data) => {
            res.status(200).send(`Updated`);
          });
    } catch (e){
        next(`updateMovie by id handler: ${e}`);
    }

});



Router.delete("/:id", async (req, res, next) => {
    try{
      let {id} = req.params;
      let sql = `DELETE FROM movies WHERE id = ${id}`;
      await client.query(sql);
      res.status(200).send('deleted from the database');
    } catch (e){
        next(`deleteMovie by id handler: ${e}`);
    }
});

//getMovie by id request
Router.get("/:id", (req, res, next)=>{
    try{
      let {id} = req.params;
      let sql = `SELECT * FROM movies WHERE id=${id}`;
      client.query(sql).then((data) => res.status(200).send(data.rows));
    }catch(e){
        next(`getMoviesById handler: ${e}`);   
    }
});


Router.get("*", errorHandeler);


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
    console.log("Welcome to  the Favorite Page");
    res.send("Welcome to  the Favorite Page");
}

function errorHandeler(req, res){
    res.send({
    "status": 500,
    "responseText": "Something went wrong"
    })
}

module.exports = Router;