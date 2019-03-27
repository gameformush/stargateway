const App = require("../App");
const Joi = require("joi");

const routers = [{
        method: "GET",
        path: "/api/starship/path/{starship}/{sector}",
        handler: function(request, h) {
            return App.getGatewayPath(+request.params.sector)
                .then(path => {
                    App.saveStarshipRequest(request.params.starship,
                        +request.params.sector,
                        path);
                    return path;
                })
        },
        options: {
            description: "Get paths",
            notes: "Returns all posiable paths and their security level for selected sector, sorted by security level, and formated in JSON.",
            validate: {
                params: {
                    starship: Joi.string().required(),
                    sector: Joi.number().required()
                },
            },
            tags: ["api"],  
            cache: {
                expiresIn: 300000 * 1000,
                privacy: "private"
            }
        }
    },
    {
        method: "GET",
        path: "/api/command-center/starships/last/position",
        handler: function(request, h) {
            return App.getStarshipsLastPosition();
        },
        options: {
            description: "Get last position",
            notes: "Returns list of all starships that requested path at least once and their last requested sector.",
            tags: ["api"]
        }
    },
    {
        method: "GET",
        path: "/api/command-center/{starship}/paths/chrono",
        handler: function(request, h) {
            return App.getStarshipRequestHistory(request.params.starship);
        },
        options: {
            description: "Get all request",
            notes: "Returns all requested paths chronologically for specified starship.",
            tags: ["api"],
            validate: {
                params: {
                    starship: Joi.string().required()
                },
            },
        }
    },
]

module.exports = routers;
