import jwt from 'jsonwebtoken';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function getSalesforceAccessToken() {
    // --- Configuration (UPDATE THESE VALUES) ---
    const CONSUMER_KEY = 'key'; // Replace with your Consumer Key
    const SALESFORCE_USERNAME = 'ralphvanderhorst@learnautomatedtesting.com'; // Replace with your Salesforce integration user's username
    const PRIVATE_KEY_PATH = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'server.key'); // Adjust path to your server.key
    const AUTH_URL = 'https://login.salesforce.com/services/oauth2/token'; // Use https://test.salesforce.com for sandboxes!

    // --- Read Private Key ---
    let privateKey;
    try {
        privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    } catch (error) {
        console.error(`Error reading private key file at ${PRIVATE_KEY_PATH}:`, error.message);
        throw new Error('Failed to read private key. Ensure it exists and path is correct.');
    }

    // --- Create JWT Payload ---
    const issuedAt = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const expiresAt = issuedAt + (5 * 60); // Token expires in 5 minutes (300 seconds)

    const jwtPayload = {
        iss: CONSUMER_KEY,
        sub: SALESFORCE_USERNAME,
        aud: 'https://login.salesforce.com', // Base URL for production
        exp: expiresAt
    };

    // --- Sign JWT ---
    let assertion;
    try {
        assertion = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' });
    } catch (error) {
        console.error('Error signing JWT:', error.message);
        throw new Error('Failed to sign JWT assertion. Check private key format or passphrase (if any).');
    }

    // --- Request Access Token from Salesforce ---
    try {
        console.log('Requesting Salesforce Access Token...');
        const response = await axios.post(AUTH_URL, new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: assertion
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Successfully obtained Salesforce Access Token.');
        return response.data; // Contains access_token, instance_url, etc.
    } catch (error) {
        console.error('Error requesting access token from Salesforce:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get Salesforce access token.');
    }
}
