export function buildPersonalInfoPageView({ nationality, birthCountry, birthState, birthCity }) {
  return {
    "type": "modal",
    "callback_id": "personal-info-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Personal Information" },
    "submit": { "type": "plain_text", "text": "Next" },
    "close": { "type": "plain_text", "text": "Close" },
    "blocks": [
      {
        "type": "input",
        "block_id": "nationality",
        "element": { "type": "plain_text_input", "action_id": "nationality_action", "initial_value": nationality || "" },
        "label": { "type": "plain_text", "text": "Nationality" },
      },
      {
        "type": "input",
        "block_id": "birth_country",
        "element": { "type": "plain_text_input", "action_id": "birth_country_action", "initial_value": birthCountry || "" },
        "label": { "type": "plain_text", "text": "Country of Birth" },
      },
      {
        "type": "input",
        "block_id": "birth_state",
        "element": { "type": "plain_text_input", "action_id": "birth_state_action", "initial_value": birthState || "" },
        "label": { "type": "plain_text", "text": "State/Region of Birth" },
      },
      {
        "type": "input",
        "block_id": "birth_city",
        "element": { "type": "plain_text_input", "action_id": "birth_city_action", "initial_value": birthCity || "" },
        "label": { "type": "plain_text", "text": "City of Birth" },
      },
    ],
  };
}
