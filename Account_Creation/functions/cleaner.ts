import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const def = DefineFunction({
  callback_id: "cleaner",
  title: "Effacer l'Historique",
  source_file: "Account_Creation/functions/cleaner.ts",
  input_parameters: {
    properties: {
      user_id: { type: Schema.slack.types.user_id },
    },
    required: ["user_id"],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  def,
  async ({ inputs, client }) => {
    const { user_id } = inputs;
    console.log(`Starting function with user_id: ${user_id}`);

    try {
      // Retrieve a list of direct message channels
      const conversationsResponse = await client.conversations.list({
        types: 'im', // Direct Message channels
      });

      console.log(`Conversations response: ${JSON.stringify(conversationsResponse)}`);

      if (conversationsResponse.error) {
        console.error(`Error fetching conversations: ${conversationsResponse.error}`);
        return { error: `Error fetching conversations: ${conversationsResponse.error}` };
      }

      // Find the channel that matches the user ID
      const channel = conversationsResponse.channels?.find(channel => channel.user === user_id);

      console.log(`Found channel: ${JSON.stringify(channel)}`);

      if (!channel) {
        console.error(`Direct message channel with user ${user_id} not found.`);
        return { error: `Channel with user ${user_id} not found.` };
      }

      // Retrieve the message history from the found channel
      const historyResponse = await client.conversations.history({
        channel: channel.id,
      });

      console.log(`Message history response: ${JSON.stringify(historyResponse)}`);

      if (historyResponse.error) {
        console.error(`Error fetching message history: ${historyResponse.error}`);
        return { error: `Error fetching message history: ${historyResponse.error}` };
      }

      const messages = historyResponse.messages;

      // Delete each message
      for (const message of messages) {
        console.log(`Deleting message with timestamp ${message.ts}`);

        const deleteResponse = await client.chat.delete({
          channel: channel.id,
          ts: message.ts,
        });

        if (deleteResponse.error) {
          console.error(`Error deleting message ${message.ts}: ${deleteResponse.error}`);
        } else {
          console.log(`Deleted message with timestamp ${message.ts}`);
        }
      }

      console.log(`Successfully deleted all messages from user ${user_id}`);
      return { completed: true };
    } catch (error) {
      console.error(`Error in clearing user message history: ${error}`);
      return { error: `Error in clearing user message history: ${error.message}` };
    }
  }
);
