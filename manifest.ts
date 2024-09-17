import { Manifest } from "deno-slack-sdk/mod.ts";

// Account_Creation /*
import AccountCreation from "./Account_Creation/workflows/demo.ts";
import DemoDataStore from "./Account_Creation/datastores/demo.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Account Opening",
  description: "Account opening process by an advisor",
  icon: "assets/customer-account-opening.png",
  workflows: [
    AccountCreation,
  ],
  outgoingDomains: [
    "httpbin.org", "maps.googleapis.com", // for External_API_Calls/functions/*
  ],
  datastores: [
    DemoDataStore, // for Datastores/*
  ],
  features: {
    appHome: {
      messagesTabEnabled: true,
      messagesTabReadOnlyEnabled: false,
    },
  },
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "groups:history",
    "emoji:read",
    "im:history",
    "im:read",
    "im:write",
    "mpim:history",
    "mpim:read",
    "mpim:write",
    "files:read",
    "files:write",
    "reactions:read",
    "reactions:write",
    "users:read",
    "datastore:read", // for Datastores/*
    "datastore:write", // for Datastores/*
  ],
});
