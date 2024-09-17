export function buildIdentityPageView({ civility, birthName, usageName, firstName, birthDate }) {
  return {
    "type": "modal",
    "callback_id": "identity-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Identité" },
    "submit": { "type": "plain_text", "text": "Suivant" },
    "close": { "type": "plain_text", "text": "Fermer" },
    "blocks": [
      {
        "type": "input",
        "block_id": "civility",
        "element": {
          "type": "radio_buttons",
          "action_id": "civility_action",
          "options": [
            { "text": { "type": "plain_text", "text": "Madame" }, "value": "Madame" },
            { "text": { "type": "plain_text", "text": "Monsieur" }, "value": "Monsieur" },
          ],
          "initial_option": civility ? { "text": { "type": "plain_text", "text": civility }, "value": civility } : undefined,
        },
        "label": { "type": "plain_text", "text": "Civilité" },
      },
      {
        "type": "input",
        "block_id": "birth_name",
        "element": { "type": "plain_text_input", "action_id": "birth_name_action", "initial_value": birthName || "" },
        "label": { "type": "plain_text", "text": "Nom de naissance" },
      },
      {
        "type": "input",
        "block_id": "usage_name",
        "optional": true,
        "element": { "type": "plain_text_input", "action_id": "usage_name_action", "initial_value": usageName || "" },
        "label": { "type": "plain_text", "text": "Nom d'usage" },
      },
      {
        "type": "input",
        "block_id": "first_name",
        "element": { "type": "plain_text_input", "action_id": "first_name_action", "initial_value": firstName || "" },
        "label": { "type": "plain_text", "text": "Prénom" },
      },
      {
        "type": "input",
        "block_id": "birth_date",
        "element": {
          "type": "plain_text_input",
          "action_id": "birth_date_action",
          "initial_value": birthDate || "",
          "placeholder": { "type": "plain_text", "text": "JJ/MM/AAAA" },
        },
        "label": { "type": "plain_text", "text": "Date de naissance (JJ/MM/AAAA)" },
      },
    ],
  };
}