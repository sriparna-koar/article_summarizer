import React, { useState } from 'react';
import axios from 'axios';

const SearchForm = () => {
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Fetch real estate data from backend server
            const response = await axios.get(`/search/${location}`);
            setResults(response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again.'); // Set error message
            setResults([]); // Clear results on error
        }
    };

    const handleFullFetch = async () => {
        try {
            // Fetch real estate data directly from the provided URL
            const response = await axios.get(`https://zillow56.p.rapidapi.com/search?location=${location}`, {
                headers: {
                    'X-RapidAPI-Key':'0ea7eb1741msh4b6b034aea1c498p16ab8djsnc2e94180977e' // Assuming you stored your RapidAPI key in an environment variable
                }
            });
            setResults(response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again.'); // Set error message
            setResults([]); // Clear results on error
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" />
                <button type="submit">Search Backend</button>
            </form>
            <button onClick={handleFullFetch}>Fetch Full Data</button>
            {/* Display search results or error message */}
            {error && <p>{error}</p>}
            {Array.isArray(results) && results.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    {results.map((property, index) => (
                        <div key={index}>
                            <h3>{property.city}, {property.country}</h3>
                            <p>Bedrooms: {property.bedrooms}</p>
                            <p>Bathrooms: {property.bathrooms}</p>
                            <p>Home Type: {property.homeType}</p>
                            <p>Days on Zillow: {property.daysOnZillow}</p>
                            <img src={property.imgSrc} alt={`Property ${index + 1}`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchForm;
