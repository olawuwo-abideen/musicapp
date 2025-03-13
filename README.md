A Music app 


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
- **GET /search?** – Search 

**Playlists**

- **GET /playlists**: Create playlists.
- **POST /playlists**: Create playlists.
- **POST /playlists**: Create playlists.
- **POST /playlists/song**: Create playlists.
- **DELETE /playlists/song**: Create playlists.





### **2. Music Library & Metadata**
- **GET /songs** – Fetch all available songs  
- **GET /songs/{songId}** – Fetch details of a specific song  
- **GET /albums** – Fetch all albums  
- **GET /albums/{albumId}** – Fetch details of a specific album  
- **GET /artists** – Fetch all artists  
- **GET /artists/{artistId}** – Fetch details of a specific artist  
- **GET /genres** – Fetch all music genres  
- **GET /genres/{genreId}** – Fetch songs under a specific genre  

---

### **3. Music Playback**
- **POST /player/play** – Start playing a song  
- **POST /player/pause** – Pause the currently playing song  
- **POST /player/next** – Skip to the next song  
- **POST /player/previous** – Play the previous song  
- **POST /player/seek** – Seek to a specific position in the song  



### **4. Playlists & Favorites**
- **GET /playlists** – Fetch user's playlists  
- **POST /playlists** – Create a new playlist  
- **PUT /playlists/{playlistId}** – Update a playlist  
- **DELETE /playlists/{playlistId}** – Delete a playlist  
- **POST /playlists/{playlistId}/songs** – Add a song to a playlist  
- **DELETE /playlists/{playlistId}/songs/{songId}** – Remove a song from a playlist  
- **GET /favorites** – Fetch the user's favorite songs  
- **POST /favorites/{songId}** – Add a song to favorites  
- **DELETE /favorites/{songId}** – Remove a song from favorites  



### **5. Search & Recommendations**
- **GET /search?query=xyz** – Search for songs, albums, or artists  
- **GET /recommendations** – Get song recommendations based on listening history  
