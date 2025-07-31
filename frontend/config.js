// Configuration for API endpoints
const config = {
    // Development (local)
    development: {
        apiBaseUrl: 'http://localhost:5000'
    },
    // Production (deployed)
    production: {
        apiBaseUrl: 'https://sfa-helpdesk-backend.onrender.com/' 
    }
};

// Get current environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const currentConfig = isProduction ? config.production : config.development;

// Export the API base URL
window.API_BASE_URL = currentConfig.apiBaseUrl; 
