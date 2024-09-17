export function buildAddressPageView() {
  return {
    "type": "modal",
    "callback_id": "address-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Adresse" },
    "submit": { "type": "plain_text", "text": "Soumettre" },
    "close": { "type": "plain_text", "text": "Fermer" },
    "blocks": [
      {
        "type": "input",
        "block_id": "street_address",
        "element": {
          "type": "plain_text_input",
          "action_id": "street_address_input",
          "placeholder": { "type": "plain_text", "text": "Entrez l'adresse" },
        },
        "label": { "type": "plain_text", "text": "Adresse complète" },
      },
      {
        "type": "input",
        "block_id": "postal_code",
        "element": {
          "type": "plain_text_input",
          "action_id": "postal_code_input",
          "placeholder": { "type": "plain_text", "text": "Code postal" },
        },
        "label": { "type": "plain_text", "text": "Code postal" },
      },
      {
        "type": "input",
        "block_id": "city",
        "element": {
          "type": "plain_text_input",
          "action_id": "city_input",
          "placeholder": { "type": "plain_text", "text": "Ville" },
        },
        "label": { "type": "plain_text", "text": "Ville" },
      },
      {
        "type": "input",
        "block_id": "country",
        "element": {
          "type": "plain_text_input",
          "action_id": "country_input",
          "placeholder": { "type": "plain_text", "text": "Pays" },
        },
        "label": { "type": "plain_text", "text": "Pays" },
      },
    ],
  };
}
