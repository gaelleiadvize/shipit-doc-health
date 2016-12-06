
module.exports = {
  app: {
    port: process.env.APP_PORT
  },
  socket: {
    port: process.env.SOCKET_PORT
  },
  botManagers: {
    activedBotManager: process.env.ACTIVED_BOT_MANAGER_NAME,
    wit : {
      token: process.env.WIT_AI_TOKEN
    }
  },
  resources: {
    publicApi: {
      ha: {
        host: process.env.PUBLICAPI_HA_HOST,
        key: process.env.PUBLICAPI_HA_KEY
      },
      sd: {
        host: process.env.PUBLICAPI_SD_HOST,
        key: process.env.PUBLICAPI_SD_KEY
      }
    },
    dataMinding: {
      ha: {
        host: process.env.MYSQL_HA_HOST,
        port: process.env.MYSQL_HA_PORT,
        user: process.env.MYSQL_HA_USER,
        password: process.env.MYSQL_HA_PASSWORD,
        database: process.env.MYSQL_HA_DB
      },
      sd: {
        host: process.env.MYSQL_SD_HOST,
        port: process.env.MYSQL_SD_PORT,
        user: process.env.MYSQL_SD_USER,
        password: process.env.MYSQL_SD_PASSWORD,
        database: process.env.MYSQL_SD_DB
      }
    }
  }
};
