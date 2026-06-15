# Station Project Setup

Welcome to the Station project! This guide will help you set up the development environment using Docker so you can start coding right away without having to manually install all the dependencies on your machine.

## Prerequisites

Make sure you have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd Station
   ```

2. **Pull the Backend Repository:**
   The backend is its own separate Git repository. You must clone or pull it into the `backend` folder:
   ```bash
   # If the backend folder is empty, clone it:
   git clone <backend_repository_url> backend
   # Or if you just need to pull the latest changes:
   cd backend
   git pull origin main
   cd ..
   ```

3. **Environment Variables:**
   Make sure you have your environment variables set up. 
   - Ask a teammate for the `.env` file and place it inside the `backend` directory: `backend/.env`.

4. **Start the Development Environment:**
   Run the following command at the root of the project to build and start the containers:
   ```bash
   docker-compose up --build
   ```
   *Note: You only need the `--build` flag the first time or when you add new dependencies (like running `npm install` or `bun install`). For subsequent runs, just `docker-compose up` is enough.*

## Live Reloading

We have configured `docker-compose.yml` to map your local files into the Docker containers. This means **you can edit the code locally on your machine, and the changes will instantly reflect in the running containers!**

- **Frontend:** Built with Vite + React. It automatically reloads when you save a file.
  - Access at: `http://localhost:5173`
- **Backend:** Built with Bun + Elysia. It runs with the `--watch` flag, so saving a backend file instantly restarts the server.
  - Access at: `http://localhost:3000`
- **Database:** PostgreSQL. It initializes with the schema located in `db/init.sql`.
  - Access at: `localhost:5432`

## Adding Dependencies

If you need to add a new package (e.g., to the frontend), you should do it from inside the container or rebuild the image:

1. Stop the containers (`Ctrl+C` or `docker-compose down`).
2. Add the dependency locally using your package manager.
3. Rebuild the containers: `docker-compose up --build`.

Happy coding!
