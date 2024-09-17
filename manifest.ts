import { Manifest } from "deno-slack-sdk/mod.ts";

// Account_Creation /*
import AccountCreation from "./Account_Creation/workflows/demo.ts";
import DemoDataStore from "./Account_Creation/datastores/demo.ts";

// History_Cleaner /*
import HistoryCleaner from "./Account_Creation/workflows/cleaner.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Ouverture de Compte",
  description: "Processus d'ouverture de compte par un conseiller",
  icon: "assets/customer-account-opening.png",
  workflows: [
    AccountCreation,
    HistoryCleaner,
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
