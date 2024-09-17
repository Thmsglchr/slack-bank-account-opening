import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

const datastore = DefineDatastore({
  name: "demo_data_store",
  primary_key: "id", // Ensure this is 'id'
  attributes: {
    id: { type: Schema.types.string }, // Correct primary key
    user_id: { type: Schema.slack.types.user_id },
    civility: { type: Schema.types.string },
    birthName: { type: Schema.types.string },
    usageName: { type: Schema.types.string },
    firstName: { type: Schema.types.string },
    birthDate: { type: Schema.types.string },
    email: { type: Schema.types.string },
    mobilePhone: { type: Schema.types.string },
    nationality: { type: Schema.types.string },
    birthCountry: { type: Schema.types.string },
    birthState: { type: Schema.types.string },
    birthCity: { type: Schema.types.string },
    street_address: { type: Schema.types.string },
    postal_code: { type: Schema.types.string },
    city: { type: Schema.types.string },
    country: { type: Schema.types.string },
  },
});

export default datastore;
