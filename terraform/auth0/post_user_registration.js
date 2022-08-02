exports.onExecutePostUserRegistration = async (event, api) => {
  api.user.setUserMetadata("extensibilityDebug", { ...event.user.user_metadata.extensibilityDebug, "action-post-user-registration": { event } })
};
