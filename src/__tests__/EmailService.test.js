
const { EmailService } = require('../EmailService');

describe('EmailService', () => {
    let service = new EmailService();

    test('should send an email successfully, eventually', async () => {
        const email = {
            to: 'test@example.com',
            subject: 'Hello World',
            body: 'This is a test email from our resilient service.'
        };

        const result = await service.sendEmail(email);
        expect(result.success).toBeTruthy();
    });
});

