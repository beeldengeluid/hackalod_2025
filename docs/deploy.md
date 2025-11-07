# Deploy LODster to lodster.ruimdetijd.nl

1. Update the version in `packages/backend/package.json`

2. Update the version in `packages/docker/docker-compose.yml`

3. Check for type errors: `npm run types:backend`

4. Make sure version control is clean: everything is checked in and pushed to Github

5. Run `./scripts/build-docker-image.sh` to check build locally

6. Run `PUSH=1 ./scripts/build-docker-image.sh` to build and push image to Docker Hub

7. Sync files to ruimdetijd.nl server: `./scripts/deploy.sh`

8. On the server run the `./up.sh` script to recreate the `lodster-backend` container
