const componentOverrideMapping = require('./componentOverrideMapping');
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');
const { DefinePlugin } = require('webpack');
const { getAvailableWebsitesConfigData } = require('./Utilities/graphQL');

module.exports = targets => {
  // Perform the asynchronous operation outside the tap
  let availableWebsites;

  // Use an IIFE (Immediately Invoked Function Expression) to enable async/await
  (async () => {
    availableWebsites = await getAvailableWebsitesConfigData();
  })();

  targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
    features[targets.name] = { i18n: true, esModules: true, cssModules: true, graphqlQueries: true };
  });

  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
  });

  targets.of('@magento/pwa-buildpack').envVarDefinitions.tap(defs => {
    defs.sections.push({
      name: "Default Website Code",
      variables: [
        {
          name: "WEBSITE_CODE",
          type: "str",
          desc: "Default Website Code for Multi Website Extension",
        },
      ],
    });
  });

  // Define the routes using the results of the asynchronous operation
  const routes = [
    {
      exact: true,
      name: "BecomeSellerRoute",
      pattern: "/become-seller",
      path: require.resolve("./components/BecomeSellerPage/index.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "SellerAccountRoute",
      pattern: "/seller-account",
      path: require.resolve("./components/SellerAccountPage/index.js"),
      authed: true,
      redirectTo: "/become-seller"
    },
  ];

  // Apply DefinePlugin using the results of the asynchronous operation
  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new DefinePlugin({
      AVAILABLE_WEBSITES: JSON.stringify(availableWebsites.availableStoresByUserIp),
      WEBSITE_CODE: process.env.WEBSITE_CODE
    }).apply(compiler);
  });

  // Handle the routes directly within the routes tap
  targets.of("@magento/venia-ui").routes.tap(routesArray => {
    routesArray.push(...routes);
    return routesArray;
  });
};