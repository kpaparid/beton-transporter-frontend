# Beton Transporter

Beton Transporter is a full stack web platform used by concrete-selling companies to collect and manage data from their drivers.


## Screenshots

![App Screenshot](https://media.giphy.com/media/InfoFlvDzbtrFOLzli/giphy.gif)

  
## Features

- State management using Redux
- Fully Responsive
- Real Time and Dynamic
- Geoapify address recommendation

- Admin's features
  - Cbm Overview
  - Driver's Workhours
  - Manage Vacations
  - Detailed Overview of Driver's Data through Data Tables (Add, Delete, Edit, Sort, Filter included)
  - Chat
  - User's Manager
  - Simplify Driver's experience through custom settings.


- Driver's features
  - Workday data (workhours, tours)
  - Vacations Planner
  - Chat
  - Overview


## Run Locally

Clone the project

```bash
  git clone https://github.com/kpaparid/beton-transporter-frontend.git
```

Go to the project directory

```bash
  cd beton-transporter-frontend
```

Install dependencies

```bash
  npm install
```

Install canteen-backend by following the guidelines in 
https://github.com/kpaparid/beton-transporter-backend.

Connect with Backend, Firebase and Geoapify by adding their paths as Environment Variables
```bash

REACT_APP_API_URL
REACT_APP_BACKEND
REACT_APP_CHAT_SERVICE
REACT_APP_GEOAPIFY_API_KEY
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

Start the server

```bash
  npm run start
```

  
## Contributing

Contributions are always welcome!

  
## License

[MIT](https://choosealicense.com/licenses/mit/)
