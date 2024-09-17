export function buildAddressPageView() {
  return {
    "type": "modal",
    "callback_id": "address-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Address" },
    "submit": { "type": "plain_text", "text": "Submit" },
    "close": { "type": "plain_text", "text": "Close" },
    "blocks": [
      {
        "type": "input",
        "block_id": "street_address",
        "element": {
          "type": "plain_text_input",
          "action_id": "street_address_input",
          "placeholder": { "type": "plain_text", "text": "Enter the address" },
        },
        "label": { "type": "plain_text", "text": "Full Address" },
      },
      {
        "type": "input",
        "block_id": "postal_code",
        "element": {
          "type": "plain_text_input",
          "action_id": "postal_code_input",
          "placeholder": { "type": "plain_text", "text": "Postal Code" },
        },
        "label": { "type": "plain_text", "text": "Postal Code" },
      },
      {
        "type": "input",
        "block_id": "city",
        "element": {
          "type": "plain_text_input",
          "action_id": "city_input",
          "placeholder": { "type": "plain_text", "text": "City" },
        },
        "label": { "type": "plain_text", "text": "City" },
      },
      {
        "type": "input",
        "block_id": "country",
        "element": {
          "type": "plain_text_input",
          "action_id": "country_input",
          "placeholder": { "type": "plain_text", "text": "Country" },
        },
        "label": { "type": "plain_text", "text": "Country" },
      },
    ],
  };
}
