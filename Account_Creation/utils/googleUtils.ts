// googleUtils.ts
export const callGoogleGeocoding = async (apiKey: string, address: string): Promise<any> => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await fetch(geocodeUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Geocoding API call failed: ${errorText}`);
        throw new Error(`Error calling Google Geocoding API: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Google Geocoding API response:', data);
  
      return data;
    } catch (error) {
      console.error('Error calling Google Geocoding API:', error);
      throw error;
    }
  };
  