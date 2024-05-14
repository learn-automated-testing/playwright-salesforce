
import newman from 'newman';
import { config } from 'dotenv';
config();




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
    const environment = await createNewmanEnvironment()
console.log(environment)
newman.run({
    collection: './Salesforceapiremoveaccounts.json',
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
}

runNewman()
