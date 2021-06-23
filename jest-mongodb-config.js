module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3', // idealmente use a mesma versão de prod
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
