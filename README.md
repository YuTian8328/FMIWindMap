# FMIWindMap

## Development

For local development, create a `./frontend/.env` file to store React environment variables, for example:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAPBOX_TOKEN=<your-token>
```

## Deployment
### Build frontend
```
rm -rf build # remove existing build folder
npm run build # build frontend
```

### Deploy to production
1. Transfer the generated `build` folder and the `backend` directory to the production server
2. Start the backend server 
3. Configure Nginx as a reverse proxy to:
   - Serve static files from the frontend build directory
   - Forward API requests to the backend server
