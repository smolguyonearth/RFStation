## Prerequisites
Make sure you have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. **Clone the repository (with submodules):**
   The `backend` is a Git submodule. To clone the main repo and the backend at the same time, run:
   ```bash
   git clone --recurse-submodules https://github.com/smolguyonearth/RFStation
   cd Station
   ```
   *(If you already cloned it normally, run `git submodule update --init --recursive` inside the Station folder).*

2. **Pulling the latest Backend code:**
   Whenever the backend code is updated, you can pull the latest changes by running:
   ```bash
   git submodule update --remote --merge
   ```

3. **Environment Variables:**
   Make sure you have your environment variables set up. 
   - Ask a teammate for the `.env` file and place it inside the `backend` and `frontend` directories: `backend/.env` and `frontend/.env`.

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

## Adding Dependencies

If you need to add a new package (e.g., to the frontend), you should do it from inside the container or rebuild the image:

1. Stop the containers (`Ctrl+C` or `docker-compose down`).
2. Add the dependency locally using your package manager.
3. Rebuild the containers: `docker-compose up --build`.

## Running Without Docker (Manual Setup)
If you prefer not to use Docker, you can run the services manually in separate terminal windows:

**1. Database**
๊๊๊Use the schema from `db/init.sql`.

**2. Backend**
```bash
cd backend
bun install
bun run dev
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```