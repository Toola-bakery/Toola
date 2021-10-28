const axios = require("axios");
const pageState = require("./modules/pageState");

const customModules = {
  pageState,
};

const API_HOST = process.env.API_HOST
  ? `https://${process.env.API_HOST}`
  : "http://localhost:8080";

const genericModuleProxy = (module, databaseId) =>
  new Proxy(
    {},
    {
      get: (target2, action) => {
        return (options) => {
          const response = axios
            .post(
              `${API_HOST}/${module}Proxy/${action}`,
              {
                ...options,
                id: databaseId,
              },
              { headers: { "auth-token": process.env.token } }
            )
            .then((resp) => resp.data);
          response.catch((e) => console.log(e?.response?.data || e));
          return response;
        };
      },
    }
  );

const SDK = new Proxy(function () {}, {
  get: (target, module) => {
    if (module in customModules) return customModules[module];
    return (id) => genericModuleProxy(module, id);
  },
  apply: function (target, thisArg, argumentsList) {
    return pageState.getProperty(
      ...(Array.isArray(argumentsList[0]) ? argumentsList[0] : argumentsList)
    );
  },
});

module.exports = SDK;
