export function buildPersonalInfoPageView({ nationality, birthCountry, birthDepartment, birthCommune }) {
  return {
    "type": "modal",
    "callback_id": "personal-info-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Infos Personnelles" },
    "submit": { "type": "plain_text", "text": "Suivant" },
    "close": { "type": "plain_text", "text": "Fermer" },
    "blocks": [
      {
        "type": "input",
        "block_id": "nationality",
        "element": { "type": "plain_text_input", "action_id": "nationality_action", "initial_value": nationality || "" },
        "label": { "type": "plain_text", "text": "Nationalité" },
      },
      {
        "type": "input",
        "block_id": "birth_country",
        "element": { "type": "plain_text_input", "action_id": "birth_country_action", "initial_value": birthCountry || "" },
        "label": { "type": "plain_text", "text": "Pays de naissance" },
      },
      {
        "type": "input",
        "block_id": "birth_department",
        "element": { "type": "plain_text_input", "action_id": "birth_department_action", "initial_value": birthDepartment || "" },
        "label": { "type": "plain_text", "text": "Département de naissance" },
      },
      {
        "type": "input",
        "block_id": "birth_commune",
        "element": { "type": "plain_text_input", "action_id": "birth_commune_action", "initial_value": birthCommune || "" },
        "label": { "type": "plain_text", "text": "Commune de naissance" },
      },
    ],
  };
}