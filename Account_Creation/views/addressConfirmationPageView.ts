export function buildAddressConfirmationPageView({ currentAddress, currentPostalCode, currentCity, currentCountry, correctedAddress, correctedPostalCode, correctedCity, correctedCountry,  }) {
    return {
      "type": "modal",
      "callback_id": "address-confirmation-page",
      "title": { "type": "plain_text", "text": "Modification d'adresse", "emoji": true },
      "submit": { "type": "plain_text", "text": "Confirmer", "emoji": true },
      "close": { "type": "plain_text", "text": "Annuler", "emoji": true },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Souhaitez-vous modifier l'adresse ?*"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Version actuelle:*"
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
              "text": "Choisir",
              "emoji": true
            },
            "value": "current_address"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Version proposée:*"
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
              "text": "Choisir",
              "emoji": true
            },
            "value": "proposed_address"
          }
        }
      ]
    };
  }
  