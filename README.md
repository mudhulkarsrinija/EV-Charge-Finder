\# ⚡ EV Charge Finder



EV Charge Finder is a web application that helps users explore electric vehicle charging stations, compare charging information, search for stations, and save favorite stations.



\## Features



\* View charging stations.

\* Search by station name, location, or charger type.

\* View charging speed and price per unit.

\* See availability status.

\* Save favorite stations using browser Local Storage.

\* Explore station markers on a map using Leaflet and OpenStreetMap.



\## Technology Stack



\### Frontend



\* Angular

\* TypeScript

\* HTML

\* CSS

\* Leaflet



\### Backend



\* Node.js

\* Express.js

\* REST API



\### Storage



\* Browser Local Storage for favorites.

\* Demonstration charging-station data served by the backend.



\## Project Structure



```text

EV-Charge-Finder/

├── backend/

│   ├── controllers/

│   ├── data/

│   ├── routes/

│   ├── server.js

│   └── package.json

├── frontend/

│   ├── src/

│   ├── angular.json

│   ├── package.json

│   └── ...

├── .gitignore

└── README.md

```



\## Prerequisites



\* Node.js and npm

\* Angular CLI

\* Git



\## Run the Backend



Open a terminal in the project directory and run:



```bash

cd backend

npm install

node server.js

```



The backend runs at:



`http://localhost:3000`



To view all charging stations, open:



`http://localhost:3000/api/stations`



\## Run the Frontend



Open another terminal and run:



```bash

cd frontend

npm install

ng serve

```



Open:



`http://localhost:4200`



Keep both the frontend and backend running while using the application.



\## Important Note



The current charging-station records are demonstration data. Station availability, prices, and locations are not verified live information.



\## Map Attribution



Map tiles are provided by OpenStreetMap. Leaflet is used to display the interactive map.



\## Future Improvements



\* Integrate verified, live charging-station data.

\* Add filters for connector type and charging speed.

\* Add directions to charging stations.

\* Improve mobile responsiveness.

\* Add user accounts and cloud-based favorites.



