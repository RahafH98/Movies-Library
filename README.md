# Movies-library
# Author Name : Rahaf Bedas 

# overview 
The project is Movies-library which is a server application that shows end points for getting movie data and displaying the favourite page. the Express.js is to handle the HTTP req and res and it has basic file ,error handling , routes.

# Getting started 
 1. The first step is to clone the repo 
 2. open the project directory 
 3. install the packages using npm 
 4. start the server 
 5. the server will rin at port 3000

 # project features 
 
 1. Home page (/) get data and response with JSON res that has the movie details.
 
 2. favourite page (/favourite) it sends a welcoming message to the user.

 3. Trending (/Trending)  it gets trending movies from MOVIE API and send the movie details with a JSON res.

 4. movie search looks for a movie by the name of it using Movie DB API and response with JSON res 

 5. upcoming (/upcoming) gets the data for up coming movies from the API and give JSON  res.

 6. popular (/popular) gets the most popular movies from the API and retirn JSON res that has the movie details.

 7. handling errors  (404 error ) --> page not found , (500 error) --> server error 
 