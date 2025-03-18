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
- **POST /auth/logout**: User logout.
- **POST /auth/forgot-password**: User forget password.
- **POST /auth/reset-password**: User reset password.

**Users Endpoint**

- **GET /user/**:Retrieve the currently authenticated user’s profile.
- **POST user/change-password**: User change password.
- **PUT /user/**: update the user’s profile.

**Songs**

- **POST /songs**: Create a songs.
- **GET /songs**: Get all songs.
- **GET /songs/:id**: Get a song.
- **PUT /songs/:id**: Update a song.
- **DELETE /songs/:id**: Remove a song.
- **GET /search?query** – Search for songs
- **GET /favorites** – Fetch the user's favorite songs  
- **POST /favorites/{songId}** – Add a song to favorites  
- **DELETE /favorites/{songId}** – Remove a song from favorites  

**Playlists**

- **GET /playlists** – Fetch user's playlists  
- **POST /playlists** – Create a new playlist  
- **GET /playlists/{playlistId}** – Get a playlist 
- **PUT /playlists/{playlistId}** – Update a playlist  
- **GET /playlists/song/{playlistId}** – Get playlist song
- **DELETE /playlists/song/{playlistId}** – Delete a playlist  
- **POST /playlists/song/{playlistId}** – Add a song to a playlist  
- **DELETE /playlists/song/{playlistId}** – Remove a song from a playlist  
