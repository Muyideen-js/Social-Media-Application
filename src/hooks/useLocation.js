import { useState, useEffect } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState({
    city: '',
    country: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        // First get coordinates
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get city and country
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        const data = await response.json();
        
        setLocation({
          city: data.city || data.locality || 'Unknown City',
          country: data.countryName || 'Unknown Country',
          loading: false,
          error: null
        });
      } catch (error) {
        setLocation({
          city: '',
          country: '',
          loading: false,
          error: 'Unable to fetch location'
        });
      }
    };

    getLocation();
  }, []);

  return location;
};

export default useLocation; 