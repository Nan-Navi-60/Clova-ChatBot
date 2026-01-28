// send_slack_report.js
import 'dotenv/config'; // Loads .env file at the start
import { readFileSync } from 'fs';
import fetch from 'node-fetch'; // Using node-fetch for HTTP requests

const REPORT_FILE = './test-results.json'; // Playwright's JSON reporter output file

async function sendSlackMessage(message) {
    const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
    if (!SLACK_WEBHOOK_URL) {
        console.error('SLACK_WEBHOOK_URL environment variable is not set in your .env file or environment.');
        return;
    }

    try {
        const response = await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message }),
        });

        if (response.ok) {
            console.log('Slack message sent successfully.');
        } else {
            console.error(`Failed to send Slack message: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.error('Response body:', errorBody);
        }
    } catch (error) {
        console.error('Error sending Slack message:', error);
    }
}

function generateSlackReport() {
    try {
        const reportContent = readFileSync(REPORT_FILE, 'utf-8');
        const report = JSON.parse(reportContent);

        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;
        let skippedTests = 0;

        report.suites.forEach(suite => {
            suite.specs.forEach(spec => {
                spec.tests.forEach(testResult => {
                    totalTests++;
                    if (testResult.status === 'passed') {
                        passedTests++;
                    } else if (testResult.status === 'failed') {
                        failedTests++;
                    } else if (testResult.status === 'skipped') {
                        skippedTests++;
                    }
                });
            });
        });

        const statusEmoji = failedTests > 0 ? '❌' : '✅';
        let message = `${statusEmoji} Playwright Test Run Summary
Total Tests: ${totalTests}
Passed: ${passedTests}
Failed: ${failedTests}
Skipped: ${skippedTests}`;

        if (failedTests > 0) {
            message += `\n\n*Failed Tests:*`;
            report.suites.forEach(suite => {
                suite.specs.forEach(spec => {
                    spec.tests.forEach(testResult => {
                        if (testResult.status === 'failed') {
                            message += `\n- ${suite.title} - ${spec.title}`;
                            testResult.errors.forEach(error => {
                                message += `\n  \`\`\`${error.message}\`\`\``;
                            });
                        }
                    });
                });
            });
        }
        
        // You might also want to include a link to the full HTML report if it's hosted
        // message += `\nFull report: <YOUR_CI_REPORT_URL>`;

        return message;

    } catch (error) {
        console.error('Error generating Slack report:', error);
        return `❌ Playwright Test Run Failed to Generate Report: ${error.message}`;
    }
}

async function main() {
    // 1. Run Playwright tests with JSON reporter
    // This step would typically be run as a separate shell command before this script.
    // For this example, I'll assume the report is already generated.
    // You would run: `npx playwright test --reporter=json`

    // 2. Generate the Slack message
    const slackMessage = generateSlackReport();

    // 3. Send to Slack
    await sendSlackMessage(slackMessage);
}

// Call the main function
main();
