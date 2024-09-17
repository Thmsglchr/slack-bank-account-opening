export function buildDocumentsPageView() {
  return {
    type: "modal",
    callback_id: "documents-page",
    notify_on_close: true,
    title: { type: "plain_text", text: "Documents" },
    submit: { type: "plain_text", text: "Soumettre", emoji: true },
    close: { type: "plain_text", text: "Fermer", emoji: true },
    blocks: [
      {
        type: "input",
        block_id: "identity_document",
        label: { type: "plain_text", text: "Pièce d'identité (recto/verso)", emoji: true },
        element: {
          type: "file_input",  // Corrected element type for file upload
          action_id: "identity_document_upload",
          filetypes: ["jpg", "jpeg", "png", "pdf"], // Allowed file types
          max_files: 1 // Limit to one file for identity document
        },
      },
      {
        type: "input",
        block_id: "domicile_proof",
        label: { type: "plain_text", text: "Justificatif de domicile", emoji: true },
        element: {
          type: "file_input",  // Corrected element type for file upload
          action_id: "domicile_proof_upload",
          filetypes: ["jpg", "jpeg", "png", "pdf"], // Allowed file types
          max_files: 1, // Limit to one file for domicile proof
        },
        optional: true, // Makes this field optional
      }
    ],
  };
}
