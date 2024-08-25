# System Documentation for EmailService

## Introduction

This document provides an overview of the `EmailService`, designed to ensure reliable email delivery through a resilient service architecture. It employs multiple strategies to handle failures, ensure unique email delivery, and manage the throughput of outgoing emails.

## System Components

### 1. **EmailProvider**
#### Purpose
Represents an email delivery system. Each provider simulates sending emails with a configurable chance of failure.

#### Key Methods
- **sendEmail(email)**: Attempts to send an email. It resolves if successful and rejects if it fails, simulating network or provider issues.

### 2. **EmailService**
#### Purpose
Manages email delivery using multiple providers, handling retries, fallbacks, and ensuring no duplicate emails are sent.

#### Key Features
- **Retry Mechanism**: Attempts to resend an email up to three times with a single provider before switching to an alternative provider.
- **Fallback Mechanism**: Switches between two email providers when persistent failures occur.
- **Idempotency**: Prevents the same email from being sent multiple times using a cryptographic hash to identify unique emails.

## Workflow

### 1. **Sending an Email**
When an email is sent using `EmailService`, it first checks for duplicates by generating a hash of the email contents. If the hash is already known, the service prevents another send attempt and logs a duplicate prevention message.
If the email is unique, the service attempts to send the email using the primary provider.
If the provider fails to send the email (simulated by a random failure chance), the service retries up to three times with exponential backoff delays.
After three failed attempts with one provider, the service switches to a secondary provider and repeats the process.
If all attempts fail after the provider switch, the service logs and returns a failure message.

### 2. **Handling Failures**
The service employs a basic form of the circuit breaker pattern by disabling a provider after it fails consistently, thus preventing further futile attempts and system strain.

## Code Examples

**Sending an Email**:
```javascript
const emailService = new EmailService();

const email = {
    to: 'recipient@example.com',
    subject: 'Test Email',
    body: 'This is a test email to demonstrate the functionality.'
};

emailService.sendEmail(email)
    .then(response => console.log(response.message))
    .catch(error => console.error(error.message));



### Step 3: Test

1. **Test** First need to add Script in package.json 
 "scripts": {
    "test": "jest"
  },

  
 - run this npm test or npx jest



### Step 4: Format and Preview

1. **Format**: VS Code automatically provides syntax highlighting for Markdown files, making it easier to see how your formatting will look.
2. **Preview**: To see how your Markdown file will appear when rendered, you can use the Markdown Preview feature in VS Code:
   - Open the Markdown file.
   - Click the **Preview** button in the upper-right corner of the editor (it looks like a split-screen icon), or press `Ctrl+Shift+V` on Windows/Linux or `Cmd+Shift+V` on macOS.

This process allows you to create well-formatted documentation directly in your coding environment, helping to keep your project organized and accessible.
