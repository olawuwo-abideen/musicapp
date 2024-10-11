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

`USERNAME=postgres`

`PASSWORD=root`

`DB_NAME=musicapp`

`NODE_ENV=development`



Enter the following `npm start` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman to test the endpoint

API Endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/


**Authentication**

- **POST /auth/signup**: User login.
- **POST /auth/login**: User logout.
- **GET /auth/enable-2fa**: Enable Two Factor Verification.
- **POST /auth/validate-2fa**: Validate Two Factor Verification.
- **GET /auth/disable-2fa**: Disable Two Factor Verification.
- **GET /auth/profile**: Get user profile.

**Playlists**

- **POST /playlists**: Create playlists.

**Songs**

- **POST /songs**: Create a songs.
- **GET /songs**: Get all songs.
- **GET /songs/:id**: Get a song.
- **PUT /songs/:id**: Update a song.
- **DELETE /songs/:id**: Remove a song.
