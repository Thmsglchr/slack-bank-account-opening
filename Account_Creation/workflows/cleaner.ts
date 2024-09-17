import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as CleanerFunction } from "../functions/cleaner.ts";

const workflow = DefineWorkflow({
  callback_id: "cleaner-workflow",
  title: "Suppression de l'Historique",
  input_parameters: {
    properties: {
      user_id: { type: Schema.slack.types.user_id }, // Define 'user_id' as a Slack user ID
    },
    required: ["user_id"], // Ensure 'user_id' is required
  },
});

workflow.addStep(CleanerFunction, {
  user_id: workflow.inputs.user_id, // Pass 'user_id' to the function correctly
});

export default workflow;
