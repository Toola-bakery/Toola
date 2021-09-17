const axios = require("axios");
const pageState = require("./modules/pageState");

const customModules = {
  pageState,
};

const genericModuleProxy = (module, databaseId) =>
  new Proxy(
    {},
    {
      get: (target2, action) => {
        return (options) => {
          const response = axios
            .post(
              `http://localhost:8080/${module}Proxy/${action}`,
              {
                ...options,
                id: databaseId,
              },
              { headers: { "auth-token": process.env.token } }
            )
            .then((resp) => resp.data);
          response.catch((e) => console.log(e.response.data));
          return response;
        };
      },
    }
  );

const SDK = new Proxy(customModules, {
  get: (target, module) => {
    if (module in target) return target[module];
    return (id) => genericModuleProxy(module, id);
  },
});

module.exports = SDK;
