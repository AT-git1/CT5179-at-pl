```
---
# EnerSave Application

EnerSave is a web application designed to help users with 24-hour electricity meters compare smart electricity meter plans. It scrapes energy prices from various websites and displays the best plans in a table format based on user inputs.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before running the application, ensure you have Node.js and npm installed on your system. You can download them from [https://nodejs.org/](https://nodejs.org/).

### Installing

Follow these steps to get your development environment running:

1. Clone the repository to your local machine.

2. Navigate to the project directory:

```sh
cd path/to/fullstack
```

Install dependencies for both the client and server parts of the application:
For the server:

#### Running the Application
The application consists of two main parts: the client and the server. You will need to run both for the application to work properly.

To run the server:
```sh
cd backend/server
npm start
```

This will start the server on port 3001.

To run the client:
```sh
cd ../../client
npm start
```

This will start the client on port 3000 and should automatically open a browser window with the application. If it doesn't, you can manually navigate to http://localhost:3000 in your browser.

#### Development Mode
To run both the client and the server concurrently in development mode, you can use the dev script from the root of the project:

```sh
npm run dev
```

This will start both the client and the server in development mode, with live reloading enabled for the client.
```