export function buildAddressConfirmationPageView({ currentAddress, currentPostalCode, currentCity, currentCountry, correctedAddress, correctedPostalCode, correctedCity, correctedCountry }) {
  return {
    "type": "modal",
    "callback_id": "address-confirmation-page",
    "title": { "type": "plain_text", "text": "Address Modification", "emoji": true },
    "submit": { "type": "plain_text", "text": "Confirm", "emoji": true },
    "close": { "type": "plain_text", "text": "Cancel", "emoji": true },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Would you like to modify the address?*"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Current version:*"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `${currentAddress}\n${currentPostalCode} ${currentCity}\n${currentCountry}`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Select",
            "emoji": true
          },
          "value": "current_address"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Proposed version:*"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `${correctedAddress}\n${correctedPostalCode} ${correctedCity}\n${correctedCountry}`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Select",
            "emoji": true
          },
          "value": "proposed_address"
        }
      }
    ]
  };
}
