export NODE_ENV=development

export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=root
export DB_NAME=devchallenge

export PORT=8080
export IP=127.0.0.1

export GATES_FILE=${shell realpath "./gates.txt"}

fill_db:
	mysql -u $(DB_USER) -p$(DB_PASSWORD) < db_model.sql

start-server:
	clear
	node ./src/server

start: fill_db start-server

test: GATES_FILE=${shell realpath "./tests/testData/gates.txt"}
test:
	clear
	mocha ./tests