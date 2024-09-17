export function buildSummaryPageView({ civility, birthName, usageName, firstName, birthDate, email, mobilePhone, nationality, birthCountry, birthDepartment, birthCommune }) {
  const blocks = [
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Civilité:* ${civility}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Nom de naissance:* ${birthName}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Prénom:* ${firstName}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Date de naissance:* ${birthDate}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Adresse email:* ${email}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Téléphone portable:* ${mobilePhone}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Nationalité:* ${nationality}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Pays de naissance:* ${birthCountry}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Département de naissance:* ${birthDepartment}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Commune de naissance:* ${birthCommune}` } }
  ];

  if (usageName) {
    blocks.splice(2, 0, { "type": "section", "text": { "type": "mrkdwn", "text": `*Nom d'usage*: ${usageName}` } });
  }

  blocks.push({
    "type": "actions",
    "block_id": "action_buttons",
    "elements": [{ "type": "button", "text": { "type": "plain_text", "text": "Modifier" }, "action_id": "modify_action" }]
  });

  return {
    "type": "modal",
    "callback_id": "completion",
    "title": { "type": "plain_text", "text": "Résumé des Informations" },
    "submit": { "type": "plain_text", "text": "Continuer" },
    "blocks": blocks
  };
}