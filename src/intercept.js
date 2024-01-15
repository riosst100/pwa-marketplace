const componentOverrideMapping = require('./componentOverrideMapping');
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');
const { DefinePlugin } = require('webpack');
const { getAvailableWebsitesConfigData } = require('./Utilities/graphQL');

/**
 * Custom intercept file for the extension
 * By default you can only use target of @magento/pwa-buildpack.
 *
 * If do want extend @magento/peregrine or @magento/venia-ui
 * you should add them to peerDependencies to your package.json
 *
 * If you want to add overwrites for @magento/venia-ui components you can use
 * moduleOverrideWebpackPlugin and componentOverrideMapping
 */
module.exports = async targets => {
  targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
      /**
       *  Wee need to activated esModules and cssModules to allow build pack to load our extension
       * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
       */
      flags[targets.name] = { esModules: true, cssModules: true, graphqlQueries: true };
  });

  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
      new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
  });

  targets.of('@magento/pwa-buildpack').envVarDefinitions.tap((defs) => {
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

  const availableWebsites = await getAvailableWebsitesConfigData();

  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new DefinePlugin({
      AVAILABLE_WEBSITES: JSON.stringify(availableWebsites.availableStoresByUserIp),
      WEBSITE_CODE: process.env.WEBSITE_CODE
    }).apply(compiler);
  });
  
  // targets.of("@magento/venia-ui").routes.tap(routes => {
  //   routes.push({
  //     name: "Become Seller",
  //     pattern: "/become-seller",
  //     path: require.resolve("../components/BecomeSeller/index.js")
  //   });
  //   return routes;
  // });
};

module.exports = (targets) => {
  targets.of("@magento/venia-ui").routes.tap((routes) => {
    routes.push({
      name: "BecomeSellerRoute",
      pattern: "/become-seller",
      path: require.resolve("./components/BecomeSellerPage/index.js"),
    });
    return routes;
  });
};