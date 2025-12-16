const componentOverrideMapping = require('./componentOverrideMapping');
const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');
const { DefinePlugin } = require('webpack');
const { getAvailableWebsitesConfigData } = require('./Utilities/graphQL');
const LocalizationPlugin = require('@magento/pwa-buildpack/lib/WebpackTools/plugins/LocalizationPlugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = targets => {
  // Perform the asynchronous operation outside the tap
  let availableWebsites;

  // Use an IIFE (Immediately Invoked Function Expression) to enable async/await
  (async () => {
    availableWebsites = await getAvailableWebsitesConfigData();
  })();

  targets.of('@magento/pwa-buildpack').transformUpward.tap(def => {
    def.staticFromRoot.inline.body.file.template.inline = './static-files/{{ filename }}';
  });

  targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
    features[targets.name] = { i18n: true, esModules: true, cssModules: true, graphqlQueries: true };
  });

  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
  });

  // Tap into webpackCompiler
  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    // Check if the LocalizationPlugin is present
    if (compiler.options.plugins) {
      const localizationPlugin = compiler.options.plugins.find(
        plugin => plugin instanceof LocalizationPlugin
      );

    // ...existing code...
      // Check if LocalizationPlugin is found
      if (localizationPlugin) {
        // Store the original mergeLocales function
        const originalMergeLocales = localizationPlugin.mergeLocales;

        // Define your custom hook
        function myCustomMergeLocalesHook(current, update) {
          // Modify the mergedLocales data here
          Object.keys(update).forEach(key => {
            if (typeof current[key] === 'undefined') {
              current[key] = [];
            }
            if (Array.isArray(current[key]) && Array.isArray(update[key])) {
              if (update[key].toString().includes("venia-ui")) {
                delete update[key];
              }
            }
          });

          // Return the modified mergedLocales
          return originalMergeLocales.call(localizationPlugin, current, update);
        }

        // Override mergeLocales with your custom hook
        localizationPlugin.mergeLocales = myCustomMergeLocalesHook;
      }
    }
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
      name: "HelpCenter",
      pattern: "/help-center",
      path: require.resolve("./components/HelpCenter/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "AboutUs",
      pattern: "/about-us",
      path: require.resolve("./components/AboutUs/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "HelpCenterQuestionDetail",
      pattern: "/help-center/question/:questionId",
      path: require.resolve("./components/HelpCenter/questionDetail.js"),
      authed: false,
    },
    {
      exact: true,
      name: "VerifyEmailPage",
      pattern: "/verify-email",
      path: require.resolve("./components/VerifyEmailPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "ConfirmEmailPage",
      pattern: "/confirm-email",
      path: require.resolve("./components/ConfirmEmailPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "SellerAccountRoute",
      pattern: "/seller-account",
      path: require.resolve("./components/SellerAccountPage/index.js"),
      authed: true,
      redirectTo: "/become-seller"
    },
    {
      exact: true,
      name: "SellerPage",
      pattern: "/seller/:urlKey",
      path: require.resolve("./components/SellerPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "SellerProductCategoriesPage",
      pattern: "/seller/:urlKey/:categoryUrlKey",
      path: require.resolve("./components/SellerPage/index.js"),
      authed: false,
    },
     {
      exact: true,
      name: "SellerProductCategoriesPage",
      pattern: "/seller/:urlKey/:categoryUrlKey/:childCategoryUrlKey",
      path: require.resolve("./components/SellerPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "CollectibleGameSetsPage",
      pattern: "/games/collectible-game/:urlKey/:productType",
      path: require.resolve("./components/CollectibleGameSetsPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "BrandListPage",
      pattern: "/brands",
      path: require.resolve("./components/BrandListPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "BrandLandingPage",
      pattern: "/brand",
      path: require.resolve("./components/BrandLandingPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "MtgSinglesPage",
      pattern: "/mtg-singles",
      path: require.resolve("./components/MtgSinglesPage/index.js"),
      authed: false,
    },
    {
      exact: true,
      name: "FavoriteSeller",
      pattern: "/favorite-seller",
      path: require.resolve("./components/FavoriteSellerPage/index.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "Quote List",
      pattern: "/quotes",
      path: require.resolve("./components/RFQPage/index.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "Quote Detail",
      pattern: "/quotes/:urlKey",
      path: require.resolve("./components/RFQPage/quoteDetailPage.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "RMA",
      pattern: "/return",
      path: require.resolve("./components/RMAPage/index.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "RMA Select",
      pattern: "/return/select",
      path: require.resolve("./components/RMAPage/RMASelectPage.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "RMA Detail",
      pattern: "/return/view/:urlKey",
      path: require.resolve("./components/RMAPage/RMADetailPage.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "New Return",
      pattern: "/return/create/:urlKey",
      path: require.resolve("./components/RMAPage/RMACreatePage.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "Order Detail",
      pattern: "/order-history/view/:urlKey",
      path: require.resolve("./components/OrderDetail/orderDetailPage.js"),
      authed: true,
      redirectTo: "/sign-in"
    },
    {
      exact: true,
      name: "Messages",
      pattern: "/messages",
      path: require.resolve("./components/MessagesPage/index.js"),
      authed: true,
      redirectTo: "/sign-in"
    }
  ];

  // Apply DefinePlugin using the results of the asynchronous operation
  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new DefinePlugin({
      AVAILABLE_WEBSITES: JSON.stringify(availableWebsites.availableStoresByUserIp),
      WEBSITE_CODE: process.env.WEBSITE_CODE
    }).apply(compiler);
  });

  const path = require('path');

  targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../src/static-files'),
          to: 'static-files'
        }
      ]
    }).apply(compiler);
  });

  // Handle the routes directly within the routes tap
  targets.of("@magento/venia-ui").routes.tap(routesArray => {
    routesArray.push(...routes);
    return routesArray;
  });

  const paymentMethods = [
    'paypal_express'
  ];

  const veniaTargets = targets.of('@magento/venia-ui');
  const gatewaysPath = '@riosst100/pwa-marketplace/src/components/PaymentMethod/';

  paymentMethods.map(method =>
    veniaTargets.checkoutPagePaymentTypes.tap(checkoutPagePaymentTypes => {
      checkoutPagePaymentTypes.add({
        paymentCode: method,
        importPath: gatewaysPath + method
      });

      return checkoutPagePaymentTypes;
    })
  );

  // targets.of('@magento/venia-ui').checkoutPagePaymentTypes.tap(checkoutPagePaymentTypes =>
  //   checkoutPagePaymentTypes.add({
  //     paymentCode: 'xendit',
  //     importPath: '@riosst100/pwa-marketplace/src/components/Xendit/xendit.js'
  //   })
  // );

  // targets.of('@magento/venia-ui').summaryPagePaymentTypes.tap(summaryPagePaymentTypes =>
  //   summaryPagePaymentTypes.add({
  //     paymentCode: 'xendit',
  //     importPath: '@riosst100/pwa-marketplace/src/components/Xendit/summary.js'
  //   })
  // );
};