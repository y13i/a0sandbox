exports.onExecutePreUserRegistration = async (event, api) => {
  api.user.setUserMetadata("extensibilityDebug", { ...event.user.user_metadata.extensibilityDebug, "action-pre-user-registration": { event } })
};
