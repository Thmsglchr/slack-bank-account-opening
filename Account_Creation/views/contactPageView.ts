export function buildContactPageView({ email, mobilePhone }) {
  return {
    "type": "modal",
    "callback_id": "contact-page",
    "notify_on_close": true,
    "title": { "type": "plain_text", "text": "Contact" },
    "submit": { "type": "plain_text", "text": "Next" },
    "close": { "type": "plain_text", "text": "Close" },
    "blocks": [
      {
        "type": "input",
        "block_id": "email",
        "element": { "type": "plain_text_input", "action_id": "email_action", "initial_value": email || "" },
        "label": { "type": "plain_text", "text": "Email Address" },
      },
      {
        "type": "input",
        "block_id": "mobile_phone",
        "element": { "type": "plain_text_input", "action_id": "mobile_phone_action", "initial_value": mobilePhone || "" },
        "label": { "type": "plain_text", "text": "Mobile Phone" },
      },
    ],
  };
}
