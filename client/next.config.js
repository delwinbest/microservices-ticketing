module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  publicRuntimeConfig: {
    STRIPE_PUB_KEY: process.env.STRIPE_PUB_KEY,
  },
};
