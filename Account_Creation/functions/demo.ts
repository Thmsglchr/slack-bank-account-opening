import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import DemoDataStore from "../datastores/demo.ts";
import { buildIdentityPageView } from "../views/identityPageView.ts";
import { buildContactPageView } from "../views/contactPageView.ts";
import { buildPersonalInfoPageView } from "../views/personalInfoPageView.ts";
import { buildSummaryPageView } from "../views/summaryPageView.ts";
import { buildDocumentsPageView } from "../views/documentsPageView.ts";
import { buildAddressPageView } from "../views/addressPageView.ts";
import { buildAddressConfirmationPageView } from "../views/addressConfirmationPageView.ts";
import { convertToTimestamp } from "../utils/dateUtils.ts";
import { callGoogleGeocoding } from "../utils/googleUtils.ts";

export const def = DefineFunction({
  callback_id: "opening-journey-demo",
  title: "Subscription Journey",
  source_file: "Account_Creation/functions/demo.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      user_id: { type: Schema.slack.types.user_id },
      timestamp: { type: Schema.types.string },
    },
    required: ["interactivity", "user_id", "timestamp"],
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

export default SlackFunction(def, async ({ inputs, client }) => {
  const userId = inputs.user_id;
  const timestamp = convertToTimestamp(inputs.timestamp);
  const entryId = `${userId}-${timestamp}`;
  const messageResponse = await client.chat.postMessage({
    channel: userId,
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: "Welcome! Would you like to continue with the account opening process?" },
      },
      {
        type: "actions",
        block_id: "start_buttons",
        elements: [
          { type: "button", text: { type: "plain_text", text: "No" }, action_id: "continue_address", style: "danger" },
          { type: "button", text: { type: "plain_text", text: "Yes" }, action_id: "yes_action", style: "primary" },
        ],
      },
    ],
  });
  if (messageResponse.error) {
    console.error(`Error sending initial message: ${messageResponse.error}`);
    return { error: messageResponse.error };
  }
  return { completed: false };
})
  .addBlockActionsHandler("yes_action", async ({ body, client, inputs }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    const response = await client.views.open({
      interactivity_pointer: body.interactivity.interactivity_pointer,
      view: buildIdentityPageView({}),
    });
    if (response.error) {
      console.error(`Error opening first page modal: ${response.error}`);
      return { error: response.error };
    }
    return { completed: false };
  })
  .addBlockActionsHandler("no_action", async ({ body, client, inputs }) => {
    const userId = inputs.user_id;
    await client.chat.postMessage({ channel: userId, text: "The account opening process has been canceled." });
    await client.chat.delete({ channel: userId, ts: body.message.ts });
    return { completed: false };
  })
  .addViewSubmissionHandler("identity-page", async ({ view, client, inputs }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    const query = await client.apps.datastore.query({
      datastore: DemoDataStore.name,
      expression: "#id = :id",
      expression_attributes: { "#id": "id" },
      expression_values: { ":id": entryId },
    });
    if (query.error) {
      console.error(`Error retrieving data: ${query.error}`);
      return { error: query.error };
    }
    const existingData = query.items[0] || {};
    const civility = view.state.values.civility.civility_action.selected_option.value;
    const birthName = view.state.values.birth_name.birth_name_action.value;
    const usageName = view.state.values.usage_name.usage_name_action.value;
    const firstName = view.state.values.first_name.first_name_action.value;
    const birthDate = view.state.values.birth_date.birth_date_action.value;
    const mergedData = {
      ...existingData,
      id: entryId,
      user_id: userId,
      civility: civility,
      birthName: birthName,
      usageName: usageName || "",
      firstName: firstName,
      birthDate: birthDate,
    };
    const storeResponse = await client.apps.datastore.put({
      datastore: DemoDataStore.name,
      item: mergedData,
    });
    if (storeResponse.error) {
      console.error(`Error storing data: ${storeResponse.error}`);
      return { error: storeResponse.error };
    }
    try {
      const contactView = buildContactPageView({
        email: existingData.email,
        mobilePhone: existingData.mobilePhone,
      });
      return { response_action: "update", view: contactView };
    } catch (error) {
      console.error("Error building contact page view:", error);
      return { error: "Failed to build contact page view" };
    }
  })
  .addViewSubmissionHandler("contact-page", async ({ view, client, inputs }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    const query = await client.apps.datastore.query({
      datastore: DemoDataStore.name,
      expression: "#id = :id",
      expression_attributes: { "#id": "id" },
      expression_values: { ":id": entryId },
    });
    if (query.error) {
      console.error(`Error retrieving data for contact page: ${query.error}`);
      return { error: query.error };
    }
    const existingData = query.items[0] || {};
    const email = view.state.values.email.email_action.value;
    const mobilePhone = view.state.values.mobile_phone.mobile_phone_action.value;
    const mergedData = {
      ...existingData,
      id: entryId,
      user_id: userId,
      email: email,
      mobilePhone: mobilePhone,
    };
    const storeResponse = await client.apps.datastore.put({
      datastore: DemoDataStore.name,
      item: mergedData,
    });
    if (storeResponse.error) {
      console.error(`Error storing contact data: ${storeResponse.error}`);
      return { error: storeResponse.error };
    }
    try {
      const personalInfoView = buildPersonalInfoPageView({
        nationality: existingData.nationality,
        birthCountry: existingData.birthCountry,
        birthDepartment: existingData.birthDepartment,
        birthCommune: existingData.birthCommune,
      });
      return { response_action: "update", view: personalInfoView };
    } catch (error) {
      console.error("Error building personal-info page view:", error);
      return { error: "Failed to build personal-info page view" };
    }
  })
  .addViewSubmissionHandler("personal-info-page", async ({ view, client, inputs }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    const existingQuery = await client.apps.datastore.query({
      datastore: DemoDataStore.name,
      expression: "#id = :id",
      expression_attributes: { "#id": "id" },
      expression_values: { ":id": entryId },
    });
    if (existingQuery.error) {
      console.error(`Error retrieving data: ${existingQuery.error}`);
      return { error: existingQuery.error };
    }
    const existingData = existingQuery.items[0] || {};
    const nationality = view.state.values.nationality.nationality_action.value;
    const birthCountry = view.state.values.birth_country.birth_country_action.value;
    const birthDepartment = view.state.values.birth_department.birth_department_action.value;
    const birthCommune = view.state.values.birth_commune.birth_commune_action.value;
    const mergedData = {
      ...existingData,
      id: entryId,
      user_id: userId,
      nationality: nationality,
      birthCountry: birthCountry,
      birthDepartment: birthDepartment,
      birthCommune: birthCommune,
    };
    const storeResponse = await client.apps.datastore.put({
      datastore: DemoDataStore.name,
      item: mergedData,
    });
    if (storeResponse.error) {
      console.error(`Error storing personal-info data: ${storeResponse.error}`);
      return { error: storeResponse.error };
    }
    try {
      const summaryView = buildSummaryPageView({ ...existingData, ...mergedData });
      return { response_action: "update", view: summaryView };
    } catch (error) {
      console.error("Error building summary page view:", error);
      return { error: "Failed to build summary page view" };
    }
  })
  .addBlockActionsHandler("modify_action", async ({ body, client, inputs }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    const query = await client.apps.datastore.query({
      datastore: DemoDataStore.name,
      expression: "#id = :id",
      expression_attributes: { "#id": "id" },
      expression_values: { ":id": entryId },
    });
    if (query.error) {
      console.error(`Error retrieving data for modification: ${query.error}`);
      return { error: query.error };
    }
    const existingData = query.items[0] || {};
    const updateResponse = await client.views.update({
      view_id: body.view.id,
      hash: body.view.hash,
      view: buildIdentityPageView({
        civility: existingData.civility,
        birthName: existingData.birthName,
        usageName: existingData.usageName,
        firstName: existingData.firstName,
        birthDate: existingData.birthDate,
      }),
    });
    if (updateResponse.error) {
      console.error(`Error reopening for modification: ${updateResponse.error}`);
      return { error: updateResponse.error };
    }
    return { completed: false };
  })
  .addViewSubmissionHandler("completion", async ({ view, client, inputs }) => {
    const userId = inputs.user_id;
    const entryId = `${userId}-${convertToTimestamp(inputs.timestamp)}`;
    const response = await client.chat.postMessage({
      channel: userId,
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: "Information recorded. Would you like to start the verification process?" },
        },
        {
          type: "actions",
          block_id: "launch_check",
          elements: [
            { type: "button", text: { type: "plain_text", text: "Start Verification", emoji: true }, action_id: "launch_check", style: "primary" },
          ],
        },
      ],
    });
    if (response.error) {
      console.error(`Error sending verification prompt: ${response.error}`);
      return { error: response.error };
    }
    return { response_action: "clear" };
  })
  .addBlockActionsHandler("launch_check", async ({ body, client }) => {
    const channelId = body.channel.id;
    const ts = body.message.ts;
    const todayDate = new Date().toISOString().split("T")[0];
    const initialReplacementBlocks = [{ type: "section", text: { type: "mrkdwn", text: "*File received: automatic checks*" } }];
    const replaceMessageResponse = await client.chat.update({ channel: channelId, ts: ts, blocks: initialReplacementBlocks });
    if (!replaceMessageResponse.ok) {
      console.error(`Failed to replace initial message: ${replaceMessageResponse.error}`);
      return { error: replaceMessageResponse.error };
    }
    const lines = [
      { emoji: "large_green_circle", title: "PPE" },
      { emoji: "large_green_circle", title: "Person Embargo" },
      { emoji: "large_green_circle", title: "Country Embargo" },
      { emoji: "large_green_circle", title: "FCC" },
      { emoji: "large_green_circle", title: "FCIP" },
    ];
    for (const line of lines) {
      const delay = Math.floor(Math.random() * (500 - 300 + 1) + 300);
      await new Promise((resolve) => setTimeout(resolve, delay));
      const block = [
        { type: "divider" },
        {
          type: "rich_text",
          elements: [
            {
              type: "rich_text_section",
              elements: [
                { type: "emoji", name: line.emoji, unicode: "1f7e2" },
                { type: "text", text: ` ${line.title}`, style: { bold: true } },
              ],
            },
          ],
        },
        { type: "context", elements: [{ type: "plain_text", text: `${todayDate} | Automatic Check`, emoji: true }] },
      ];
      const fetchMessageResponse = await client.conversations.history({
        channel: channelId,
        latest: ts,
        inclusive: true,
        limit: 1,
      });
      if (!fetchMessageResponse.ok || !fetchMessageResponse.messages.length) {
        console.error(`Failed to fetch existing message: ${fetchMessageResponse.error}`);
        return { error: fetchMessageResponse.error };
      }
      const existingBlocks = fetchMessageResponse.messages[0].blocks || [];
      const updatedBlocks = [...existingBlocks, ...block];
      const editMessageResponse = await client.chat.update({ channel: channelId, ts: ts, blocks: updatedBlocks });
      if (!editMessageResponse.ok) {
        console.error(`Failed to update message: ${editMessageResponse.error}`);
        return { error: editMessageResponse.error };
      }
    }
    const finalButtonBlock = [
      { type: "divider" },
      {
        type: "actions",
        block_id: "continue_documents",
        elements: [
          { type: "button", text: { type: "plain_text", text: "Continue", emoji: true }, action_id: "continue_documents", style: "primary" },
        ],
      },
    ];
    const finalFetchMessageResponse = await client.conversations.history({ channel: channelId, latest: ts, inclusive: true, limit: 1 });
    if (!finalFetchMessageResponse.ok || !finalFetchMessageResponse.messages.length) {
      console.error(`Failed to fetch existing message for final button: ${finalFetchMessageResponse.error}`);
      return { error: finalFetchMessageResponse.error };
    }
    const finalExistingBlocks = finalFetchMessageResponse.messages[0].blocks || [];
    const finalUpdatedBlocks = [...finalExistingBlocks, ...finalButtonBlock];
    const addFinalButtonResponse = await client.chat.update({ channel: channelId, ts: ts, blocks: finalUpdatedBlocks });
    if (!addFinalButtonResponse.ok) {
      console.error(`Failed to add final button: ${addFinalButtonResponse.error}`);
      return { error: addFinalButtonResponse.error };
    }
    return { completed: false };
  })
  .addBlockActionsHandler("continue_documents", async ({ body, client, inputs }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    const response = await client.views.open({ interactivity_pointer: body.interactivity.interactivity_pointer, view: buildDocumentsPageView({}) });
    if (response.error) {
      console.error(`Error opening Documents page modal: ${response.error}`);
      return { error: response.error };
    }
    return { completed: false };
  })
  .addViewSubmissionHandler("documents-page", async ({ view, client, inputs }) => {
    const userId = inputs.user_id;
    const entryId = `${userId}-${convertToTimestamp(inputs.timestamp)}`;
    const closeModalResponse = { response_action: "clear" };
    const verificationMessage = "Would you like to start the verification of the uploaded documents?";
    try {
      const verificationResponse = await client.chat.postMessage({
        channel: userId,
        text: verificationMessage,
        blocks: [
          { type: "section", text: { type: "mrkdwn", text: verificationMessage } },
          {
            type: "actions",
            block_id: "launch_document_verification",
            elements: [
              { type: "button", text: { type: "plain_text", text: "Start Verification", emoji: true }, action_id: "launch_verification", style: "primary" },
            ],
          },
        ],
      });
      if (verificationResponse.error) {
        console.error(`Error sending verification message: ${verificationResponse.error}`);
        return { error: verificationResponse.error };
      }
    } catch (error) {
      console.error(`Error during view submission handler: ${error}`);
      return { error: "Failed to handle view submission for documents page." };
    }
    return closeModalResponse;
  })
  .addBlockActionsHandler("launch_verification", async ({ body, client }) => {
    const userId = body.user.id;
    const messageTs = body.message.ts;
    const channelId = body.channel.id;
    const identityDocumentName = "cni_maelys_martin.jpg";
    const domicileProofName = "facture_edf_maelys_martin.pdf";
    const initialReplacementBlocks = [{ type: "section", text: { type: "mrkdwn", text: "*Document Verification*" } }];
    const lines = [
      { emoji: "white_check_mark", title: "Identity Document", fileName: identityDocumentName },
      { emoji: "white_check_mark", title: "Proof of Address", fileName: domicileProofName },
    ];
    const editInitialMessageResponse = await client.chat.update({ channel: channelId, ts: messageTs, blocks: initialReplacementBlocks });
    if (editInitialMessageResponse.error) {
      console.error(`Error replacing initial message: ${editInitialMessageResponse.error}`);
      return { error: editInitialMessageResponse.error };
    }
    for (const line of lines) {
      const lineBlock = [
        { type: "section", fields: [{ type: "mrkdwn", text: `:${line.emoji}: *${line.title}*` }, { type: "mrkdwn", text: `_${line.fileName}_` }] },
      ];
      await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (1200 - 700 + 1)) + 700));
      const appendLineResponse = await client.chat.update({ channel: channelId, ts: messageTs, blocks: [...initialReplacementBlocks, ...lineBlock] });
      if (appendLineResponse.error) {
        console.error("Failed to append line to message. Response was:", appendLineResponse);
        return { error: "Failed to append line to message." };
      }
      initialReplacementBlocks.push(...lineBlock);
    }
    const continueButtonBlock = [
      {
        type: "actions",
        block_id: "continue_address",
        elements: [{ type: "button", text: { type: "plain_text", text: "Continue", emoji: true }, action_id: "continue_address", style: "primary" }],
      },
    ];
    const addContinueButtonResponse = await client.chat.update({ channel: channelId, ts: messageTs, blocks: [...initialReplacementBlocks, ...continueButtonBlock] });
    if (addContinueButtonResponse.error) {
      console.error('Failed to add "Continue" button. Response was:', addContinueButtonResponse);
      return { error: 'Failed to add "Continue" button.' };
    }
    return { completed: false };
  })
  .addBlockActionsHandler("continue_address", async ({ body, client }) => {
    const userId = body.user.id;
    const interactivityPointer = body.interactivity.interactivity_pointer;
    if (!interactivityPointer) {
      console.error("Missing interactivity pointer in the payload");
      return { error: "Invalid request: missing interactivity pointer." };
    }
    const response = await client.views.open({ interactivity_pointer: interactivityPointer, view: buildAddressPageView() });
    if (!response.ok) {
      console.error(`Error opening Address page modal: ${response.error}`);
      return { error: response.error };
    }
    return { completed: false };
  })
  .addViewSubmissionHandler("address-page", async ({ view, client, inputs, env }) => {
    const userId = inputs.user_id;
    const timestamp = convertToTimestamp(inputs.timestamp);
    const entryId = `${userId}-${timestamp}`;
    console.log(`Handling address-page submission for user: ${userId}, entryId: ${entryId}`);
    console.log("Querying datastore for existing data...");
    const query = await client.apps.datastore.query({
      datastore: DemoDataStore.name,
      expression: "#id = :id",
      expression_attributes: { "#id": "id" },
      expression_values: { ":id": entryId },
    });
    if (query.error) {
      console.error(`Error retrieving data: ${query.error}`);
      return { error: query.error };
    }
    console.log("Datastore query successful. Existing data retrieved:", query.items[0]);
    const existingData = query.items[0] || {};
    const streetAddress = view.state.values.street_address.street_address_input.value;
    const postalCode = view.state.values.postal_code.postal_code_input.value;
    const city = view.state.values.city.city_input.value;
    const country = view.state.values.country.country_input.value;
    console.log("User-submitted address:", { streetAddress, postalCode, city, country });
    const apiKey = env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("Google API key is missing");
      return { error: "Google API key is not set." };
    }
    const fullAddress = `${streetAddress}, ${postalCode} ${city}, ${country}`;
    console.log(`Preparing to call Google Geocoding API for address: ${fullAddress}`);
    try {
      const geocodeData = await callGoogleGeocoding(apiKey, fullAddress);
      console.log("Received response from Google Geocoding API:", geocodeData);
      if (geocodeData.status === "OK") {
        const streetNumber = geocodeData.results[0].address_components.find((comp) =>
          comp.types.includes("street_number")
        )?.long_name || "";
        const streetName = geocodeData.results[0].address_components.find((comp) =>
          comp.types.includes("route")
        )?.long_name || "";
        const correctedAddress = streetNumber ? `${streetNumber} ${streetName}` : streetAddress;
        const correctedPostalCode = geocodeData.results[0].address_components.find((comp) =>
          comp.types.includes("postal_code")
        )?.long_name || postalCode;
        const correctedCity = geocodeData.results[0].address_components.find((comp) =>
          comp.types.includes("locality")
        )?.long_name || city;
        const correctedCountry = geocodeData.results[0].address_components.find((comp) =>
          comp.types.includes("country")
        )?.long_name || country;
        console.log("Corrected address components:", {
          correctedAddress,
          correctedPostalCode,
          correctedCity,
          correctedCountry,
        });
        const addressConfirmationView = buildAddressConfirmationPageView({
          currentAddress: streetAddress,
          currentPostalCode: postalCode,
          currentCity: city,
          currentCountry: country,
          correctedAddress: correctedAddress,
          correctedPostalCode: correctedPostalCode,
          correctedCity: correctedCity,
          correctedCountry: correctedCountry,
        });
        console.log("Address confirmation view built successfully.");
        return { response_action: "update", view: addressConfirmationView };
      } else {
        console.error(`Geocoding API error: ${geocodeData.status}, error_message: ${geocodeData.error_message || "Unknown error"}`);
        return { error: `Failed to validate the address: ${geocodeData.error_message || "Unknown error"}` };
      }
    } catch (error) {
      console.error("Error calling Google Geocoding API:", error);
      return { error: "Failed to connect to address validation service." };
    }
  });
