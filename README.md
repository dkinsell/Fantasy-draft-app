# Fantasy Football Draft Application

The Fantasy Football Draft App is a tool designed to allow you to use custom spreadsheets during your fantasy football draft. You can upload player data, mark players as drafted by you or other players in the league, and reset draft statuses as needed. This tool is handy when you don't have access to an official draft app or simlpy want to use your own custom player list instead of what is provided for you through an official app.

The basic workflow:

- Choose the file you want to upload
- Upload the file
- Click either Draft by me or Draft by other dpending on who drafts the player
- Click reset draft status if the player is incorrectly marked
- Use the reset button to clear the page

File explanation:

- playerController.js: updates player draft status
- uploadController.js: parses file data, saves to DB, and sends player data back to client
- players.js: model for our player data
- player.js: routes requests to our playerController
- upload.js: routes requests to our uploadController
- veryify.js: purely for testing upload workflow before connecting DB
- FileUpload.jsx: component for handling the file upload
- Header.jsx: simple header for the page, no functionality
- PlayerComponent.jsx: component for each player row
- PlayerTable.jsx: component that holds all our player rows in a table with functionality to create each row
- App.jsx: main app page with functionality to refresh on change of state
- App.scss: styling
- index.html: basic html page
- index.js: root page to render the app
- uploads folder: holds all the uploaded files
- server.js: configures express, connects to Mongo, and defines our routes

Areas for iteration:

- Add search bar to look up players
- Filtering by column
- Add a roster that tracks players drafted by user
- Additional file type uploads
- Improvement of UX/UI and styling
- Dynamic parsing of data so spreadsheet structure can be more varied
