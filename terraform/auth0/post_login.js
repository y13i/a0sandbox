const { createLogger, transports, format } = require("winston");
const { ManagementClient } = require("auth0");

const logger = createLogger({
  transports: [new transports.Console()],
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.metadata({
      fillExcept: ["timestamp", "level", "message"],
    }),
    format.json()
  ),
});

logger.debug("logger initialized");

exports.onExecutePostLogin = async (event, api) => {
  const managementClient = new ManagementClient({
    domain: event.secrets.domain,
    clientId: event.secrets.clientId,
    clientSecret: event.secrets.clientSecret,
  });

  await managementClient.updateAppMetadata({ id: event.user.user_id }, { extensibilityDebug: { ...event.user.app_metadata.extensibilityDebug, "action_post-login": { event } } })
};
