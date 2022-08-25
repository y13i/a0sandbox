exports.onExecutePreUserRegistration = async (event, api) => {
  api.user.setAppMetadata("extensibilityDebug", {
    "action_pre-user-registration": {
      ...event,
      secrets: "REDUCTED",
    }
  });
};
