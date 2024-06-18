import newman from 'newman';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
const result = dotenv.config();
if (result.error) {
  // If .env file doesn't exist, ensure environment variables are set
  if (!process.env.SF_CLIENT_ID || !process.env.SF_CLIENT_SECRET) {
    throw new Error('Missing required environment variables SF_CLIENT_ID or SF_CLIENT_SECRET');
  }
} else {
  console.log(result.parsed); 
}
console.log('Client ID:', process.env.SF_CLIENT_ID);
console.log('Client Secret:', process.env.SF_CLIENT_SECRET);

// Function to create Newman environment from .env variables
async function createNewmanEnvironment() {
    return {
        id: "env-id", // Custom ID for your environment
        name: "Dynamic Environment",
        values: [
            { key: "client_id", value: process.env.SF_CLIENT_ID, enabled: true },
            { key: "client_secret", value: process.env.SF_CLIENT_SECRET, enabled: true }
        ]
    };
}

// Run Newman with the dynamically created environment
async function runNewman() {
    try {
        const environment = await createNewmanEnvironment();
        console.log('Environment:', environment);
        newman.run({
            collection: path.join(__dirname, './Salesforceapiremoveaccounts.json'),
            environment: environment,
            reporters: ['cli'] // Only CLI output for reporting
        }, (err, summary) => {
            if (err) {
                console.error('Error occurred:', err);
            } else {
                console.log('Collection run complete!');
                console.log('Total Executions:', summary.run.executions.length);
                console.log('Total Failures:', summary.run.failures.length);
                console.log('Total Tests:', summary.run.stats.tests.total);
            }
        });
    } catch (error) {
        console.error('An error occurred while running Newman:', error);
    }
}

runNewman();
