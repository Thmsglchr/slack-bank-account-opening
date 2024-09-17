import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { def as Demo } from "../functions/demo.ts";

const workflow = DefineWorkflow({
  callback_id: "demo-workflow",
  title: "Ouverture de Compte",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      user_id: { type: Schema.slack.types.user_id }, // Define 'user_id' as a Slack user ID
      timestamp: { type: Schema.slack.types.timestamp },
    },
    required: ["interactivity", "user_id", "timestamp"], // Make 'user_id' required
  },
  output_parameters: {
    properties: {
      city: { type: Schema.types.string },
      country: { type: Schema.types.string },
      email: { type: Schema.types.string },
      firstName: { type: Schema.types.string },
      mobilePhone: { type: Schema.types.string },
      postalCode: { type: Schema.types.string },
      streetAddress: { type: Schema.types.string },
      usageName: { type: Schema.types.string },
    },
    required: [
      "city",
      "country",
      "email",
      "firstName",
      "mobilePhone",
      "postalCode",
      "streetAddress",
      "usageName",
    ],
  },
});

workflow.addStep(Demo, {
  interactivity: workflow.inputs.interactivity,
  user_id: workflow.inputs.user_id, // Pass 'user_id' to the function correctly
  timestamp: workflow.inputs.timestamp, // Get the moment when the workflow was launched to generate a unique ID for datastore
});

export default workflow;
