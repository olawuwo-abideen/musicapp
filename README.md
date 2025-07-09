A Music app that allows users to explore, play, and manage their favorite songs. It includes functionalities such as user authentication, music playback, playlists, favorites, and search capabilities. Users can browse songs by artists, albums, and genres, create custom playlists, and enjoy seamless music streaming. 

Installation

- clone the repository


`git clone git@github.com:olawuwo-abideen/musicapp.git`


- navigate to the folder


`cd musicapp-main.git`

To run the app in development mode

Open a terminal and enter the following command to install all the  modules needed to run the app:

`npm install`


Create a `.env` file with

`PORT=3000`

`SECRET=secret`

`DB_HOST=localhost`

`DB_PORT=5432`

`DB_USERNAME=postgres`

`PASSWORD=root`

`DB_NAME=musicapp`

`NODE_ENV=development`



Enter the following `npm start` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman to test the endpoint

API Endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/




**Authentication Endpoint**

- **POST /auth/signup**: User signup.
- **POST /auth/login**: User login.
- **GET /auth/google/login**: Google login.
- **POST /auth/logout**: User logout.
- **GET /auth/google/redirect**: Google login redirect.
- **POST /auth/cloudfare-verify**: Cloudfare verify.
- **POST /auth/forgot-password**: User forget password.
- **POST /auth/reset-password**: User reset password.

**Users Endpoint**

- **GET /user/**:Retrieve the currently authenticated user’s profile.
- **POST user/change-password**: User change password.
- **PUT /user/**: update the user’s profile.
- **POST user/change-password**: User change password.
- **POST user/initiate-mfa**: Initiate Multi Factor Authentication.
- **POST user/verify-mfa**: Validate Multi Factor Authentication.
- **POST user/disable-mfa**:Disable Multi Factor Authentication.

**Songs**

- **POST /song**: Create a songs.
- **GET /song**: Get all songs.
- **GET /song/:id**: Get a song.
- **PUT /song/:id**: Update a song.
- **DELETE /song/:id**: Remove a song.
- **GET /search?query** – Search for songs
- **GET song/favorites** – Fetch the user's favorite songs  
- **POST song/favorites/{songId}** – Add a song to favorites  
- **DELETE song/favorites/{songId}** – Remove a song from favorites  

**Playlists**

- **GET /playlists** – Fetch user's playlists  
- **POST /playlists** – Create a new playlist  
- **GET /playlists/{playlistId}** – Get a playlist 
- **PUT /playlists/{playlistId}** – Update a playlist  
- **GET /playlists/song/{playlistId}** – Get playlist song
- **DELETE /playlists/song/{playlistId}** – Delete a playlist  
- **POST /playlists/song/{playlistId}** – Add a song to a playlist  
- **DELETE /playlists/song/{playlistId}** – Remove a song from a playlist  


**Artist**

- **GET /artist** – Fetch all artists 
- **POST /artist** – Create an artist  
- **GET artist/search/query** – Search artist
- **GET /artist/{artistId}** – Get artist 
- **PUT /artist/{artistId}** – Update an artist 
- **DELETE /artist/{artistId}** – Delete artist  
- **GET /artist/leaderboard** – Get top artist


**Album**

- **GET /album** – Fetch album
- **POST /album** – Create an album 
- **GET /album/{albumId}** – Get an album
- **DELETE /album/{albumId}** – Delete an album 
- **PUT /album/{albumId}** – Update an album  
- **GET album/search/query** – Search album
- **POST /album/{songId}/{albumId}** – Add song to album
- **POST /album/{songId}** – Remove song from album



**Follow**

- **POST /follow/{artistId}** – Follow an artist
- **DELETE /follow/{artistId}** – Unfollow an artist
- **GET /follow/followers/{artistId}** – Get artist follower 


**Like**

- **POST /likes/{songId}** – Like a song
- **DELETE /likes/{songId}** – UnLike a song
- **GET /likes/count/{songId}** – Get song like


**Subscription**

- **POST /subscription/plans** – Create a plan
- **GET /subscription/plans/user** – Get current user plan
- **GET /subscription/plans** – Get all plans
- **POST /subscription/plans/renew** – Get song like


**Feedback**

- **POST /feedback/{songId}** – Submit feedback for the app
- **POST /feedback/report/song/:id** – Report a song


**Analytics**

- **GET /analytics/user/stats** – Get user statistics
- **GET /analytics/artist/stats/:id** – Get artist statistics


**Recommendation**

- **POST /feedback/trending** – Get trending songs
- **POST /feedback/songs** – Recommend songs