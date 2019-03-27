#Star gateway application

## Required Prerequisites

* Vagrant
* Node.js
* MySQL

## Running tests
```
npm test
```
## Running application
Vagrant should be started from root folder.
`vagrant up`

Input file `gates.txt` must be in root folder if using vagrant.
To specify file name change `GATES_FILE` in Makefile.

Or start with `npm start`

With this approach input file can be anywhere, but path to it must be absolute.


## Configuration

Change `Makefile` to configure app: db settings, port, node_env

## Api documentation
```
http://localhost:8080/documentation
```
### Requesting path to sector 56
```
curl  localhost:8080/api/starship/path/{myStarship}/56
```

Where `{myStarship}` is name of your starship.

### Get current location of all ships
```
curl localhost:8080/api/command-center/starships/last/position
```

### Get starship requests chronologicaly

```
curl localhost:8080/api/command-center/{starship}/paths/chrono
```

Where `{myStarship}` is name of your starship.