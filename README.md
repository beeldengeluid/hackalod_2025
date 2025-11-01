# hackalod_2025
To be used by the "Imagine all the people" team for HackaLOD 2025

- [Functioneel ontwerp](./docs/fo.md) WiP
- [Repo](./docs/repo.md)
- [Wat ideeen](./docs/ideeen.md)
- [Triplestore](./docs/triplestore.md)
- [ToDo](./docs/todo.md)

Some SPARQL queries for public Muziekweb data are added in `/queries`. These can be useful for the Musiant/LODster application idea.

Some data files are located in `/data` and some helper files in `/support`.


## Install and run

```sh
cd packages
npm install
```

Check the run options, within same packages dir:

```sh
npm run
```

Then to start the backend server run:

```sh
npm run dev --workspace backend
DEBUG=hackalod:* npm run dev --workspace @hackalod2025/backend
```

You'll see the address the API is running. You can copy paste it to your browser

```sh
npm run dev --workspace frontend
DEBUG=hackalod:* npm run dev --workspace @hackalod2025/frontend
```

You'll see the address the game UI is running. You can copy paste it to your browser