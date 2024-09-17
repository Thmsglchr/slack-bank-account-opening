export function buildSummaryPageView({ civility, birthName, usageName, firstName, birthDate, email, mobilePhone, nationality, birthCountry, birthState, birthCity }) {
  const blocks = [
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Title:* ${civility}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Birth Name:* ${birthName}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*First Name:* ${firstName}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Date of Birth:* ${birthDate}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Email Address:* ${email}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Mobile Phone:* ${mobilePhone}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Nationality:* ${nationality}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*Country of Birth:* ${birthCountry}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*State of Birth:* ${birthState}` } },
    { "type": "section", "text": { "type": "mrkdwn", "text": `*City of Birth:* ${birthCity}` } }
  ];

  if (usageName) {
    blocks.splice(2, 0, { "type": "section", "text": { "type": "mrkdwn", "text": `*Preferred Name*: ${usageName}` } });
  }

  blocks.push({
    "type": "actions",
    "block_id": "action_buttons",
    "elements": [{ "type": "button", "text": { "type": "plain_text", "text": "Modify" }, "action_id": "modify_action" }]
  });

  return {
    "type": "modal",
    "callback_id": "completion",
    "title": { "type": "plain_text", "text": "Information Summary" },
    "submit": { "type": "plain_text", "text": "Continue" },
    "blocks": blocks
  };
}
