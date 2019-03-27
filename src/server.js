const Hapi = require("hapi");
const path = require("path");
const logger = require("./utility/logger");
const Vision = require("vision");
const Inert = require("inert");
const HapiSwagger = require("hapi-swagger");

const routes = require("./routes");

const port = process.env.PORT || 8080;

const server = Hapi.server({
    "port": port,
    "routes": {
        "cors": true
    }
})

const init = async () => {
    server.route(routes);

    const swaggerOptions = {
       info: {
               title: "API Documentation"
           },
       };
   
   await server.register([
       Inert,
       Vision,
       {
           plugin: HapiSwagger,
           options: swaggerOptions
       }
   ]);

    await server.start();
    logger.log("info", `Server started at: ${server.info.uri}`);
}

const stop = async () => {
    await server.stop({ timeout: 10000 });
    logger.log("info", "hapi server stopped");
    process.exit(0);
}

if (require.main === module) {
    init();

    process.on("unhandledRejection", (err) => {
        logger.log("error", JSON.stringify(err));
        process.exit(1);
    });

    process.on("SIGINT", async function() {
        logger.log("info", "stopping hapi server on SIGINT signal");
        try {
            stop();
        } catch (err) {
            process.exit(err ? 1 : 0);
        }
    })
} else {
    module.exports = {
        server: server,
        init: init,
        stop: stop,
        port: port
    }
}
