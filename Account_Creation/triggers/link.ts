import { Trigger } from "deno-slack-sdk/types.ts";
import workflow from "../workflows/demo.ts";

/**
 * This trigger starts the workflow when an end-user clicks the link.
 * Learn more at https://api.slack.com/automation/triggers/link
 */
const trigger: Trigger<typeof workflow.definition> = {
  type: "shortcut",
  name: "Demo Trigger",
  workflow: `#/workflows/${workflow.definition.callback_id}`,
  inputs: {
    // interactivity is necessary for opening a modal
    interactivity: { value: "{{data.interactivity}}" },
  },
};

// Note that the Trigger object must be default-exported
export default trigger;
