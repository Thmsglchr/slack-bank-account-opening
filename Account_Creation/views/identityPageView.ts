export function buildIdentityPageView({ civility, birthName, usageName, firstName, birthDate }) {
  return {
    "type": "modal",
    "callback_id": "identity-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Identity" },
    "submit": { "type": "plain_text", "text": "Next" },
    "close": { "type": "plain_text", "text": "Close" },
    "blocks": [
      {
        "type": "input",
        "block_id": "civility",
        "element": {
          "type": "radio_buttons",
          "action_id": "civility_action",
          "options": [
            { "text": { "type": "plain_text", "text": "Ms." }, "value": "Ms." },
            { "text": { "type": "plain_text", "text": "Mr." }, "value": "Mr." },
          ],
          "initial_option": civility ? { "text": { "type": "plain_text", "text": civility === "Ms." ? "Mrs." : "Mr." }, "value": civility } : undefined,
        },
        "label": { "type": "plain_text", "text": "Title" },
      },
      {
        "type": "input",
        "block_id": "birth_name",
        "element": { "type": "plain_text_input", "action_id": "birth_name_action", "initial_value": birthName || "" },
        "label": { "type": "plain_text", "text": "Birth Name" },
      },
      {
        "type": "input",
        "block_id": "usage_name",
        "optional": true,
        "element": { "type": "plain_text_input", "action_id": "usage_name_action", "initial_value": usageName || "" },
        "label": { "type": "plain_text", "text": "Preferred Name" },
      },
      {
        "type": "input",
        "block_id": "first_name",
        "element": { "type": "plain_text_input", "action_id": "first_name_action", "initial_value": firstName || "" },
        "label": { "type": "plain_text", "text": "First Name" },
      },
      {
        "type": "input",
        "block_id": "birth_date",
        "element": {
          "type": "plain_text_input",
          "action_id": "birth_date_action",
          "initial_value": birthDate || "",
          "placeholder": { "type": "plain_text", "text": "DD/MM/YYYY" },
        },
        "label": { "type": "plain_text", "text": "Date of Birth (DD/MM/YYYY)" },
      },
    ],
  };
}
