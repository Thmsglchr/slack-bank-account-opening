// Function to convert date string to timestamp
export function convertToTimestamp(dateString: string): number {
  const cleanedDateString = dateString
    .replace(" at ", " ")
    .replace(/(\d+)(st|nd|rd|th)/, "$1") // Remove the ordinal suffix
    .replace(",", ""); // Remove any commas

  const date = new Date(cleanedDateString);
  return date.getTime();
}