

const crypto = require('crypto');

function hashEmail(email) {
    const { to, subject, body } = email;
    return crypto.createHash('sha256').update(`${to}${subject}${body}`).digest('hex');
}

class EmailProvider {
    constructor(name) {
        this.name = name;
        this.failureRate = 0.5;
        this.operational = true; 
    }

    sendEmail(email) {
        return new Promise((resolve, reject) => {
            if (!this.operational) {
                return reject(new Error(`${this.name} is currently out of service.`));
            }
            setTimeout(() => {
                const success = Math.random() > this.failureRate;
                if (success) {
                    resolve({ success: true, message: "Email sent successfully" });
                } else {
                    reject(new Error("Failed to send email"));
                }
            }, 100);
        });
    }

    simulateFailure() {
        this.failureRate = 1.0; 
    }

    restore() {
        this.failureRate = 0.5;
        this.operational = true;
    }

    fail() {
        this.operational = false;
    }
}

class EmailService {
    constructor() {
        this.providers = [new EmailProvider('Provider 1'), new EmailProvider('Provider 2')];
        this.primaryIndex = 0;
        this.retryDelays = [1000, 3000, 5000]; 
        this.sentEmails = new Set(); 
        this.failureCount = 0;
        this.maxFailures = 3; 
    }

    async sendEmail(email) {
        const emailHash = hashEmail(email);
        if (this.sentEmails.has(emailHash)) {
            console.log("Duplicate email prevented.");
            return { success: false, message: "Duplicate email prevented" };
        }

        for (let attempt = 0; attempt < this.retryDelays.length; attempt++) {
            try {
                await this.delay(this.retryDelays[attempt]);
                const result = await this.providers[this.primaryIndex].sendEmail(email);
                this.sentEmails.add(emailHash);
                this.resetFailures();
                console.log("Email sent successfully on attempt:", attempt + 1);
                return result;
            } catch (error) {
                console.log(`Attempt ${attempt + 1} for ${this.providers[this.primaryIndex].name} failed: ${error.message}`);
                this.recordFailure();
                if (this.failureCount >= this.maxFailures) {
                    this.switchProvider();
                }
            }
        }

        console.log("All attempts failed. Email not sent.");
        return { success: false, message: "All attempts failed. Email not sent." };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    switchProvider() {
        this.primaryIndex = (this.primaryIndex + 1) % this.providers.length;
        this.providers[this.primaryIndex].fail(); 
        console.log(`Switched to ${this.providers[this.primaryIndex].name}`);
    }

    resetFailures() {
        this.failureCount = 0;
    }

    recordFailure() {
        this.failureCount++;
    }
}

module.exports = { EmailService };
