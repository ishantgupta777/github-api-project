# Github Assignment

By [Ishant](https://ishantgupta.in).

### `Steps to run locally:`

#### `Method 1 (using docker)`

- If you don't have docker installed locally then follow this [guide](https://docs.docker.com/engine/install/)
- Run below command in root folder of the project

```
docker-compose up --build
```

#### `Method 2 (using node js)`

- If you don't have nodejs installed locally, download from [here](https://nodejs.org/en/download/)
- Run below command in root folder of the project

```
npm install
npm start
```

### Some points:

- M value (num of committees) can be atmax 100
- GitHub client token added in the codebase itself instead of .env file, so that GitHub api don't show limit exceeded
