import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

export default class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.username.split(' ')[0];
		this.url = url;
		this.from = `Wardi Team - <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// Sendgrid | Production
			return nodemailer.createTransport({
				service: 'SendGrid',
				auth: {
					user: process.env.S_USER,
					pass: process.env.S_KEY,
				},
			});
		}
		// Mailtrap | Development
		return nodemailer.createTransport({
			host: process.env.M_HOST,
			port: process.env.M_PORT,
			auth: {
				user: process.env.M_USER,
				pass: process.env.M_PASS,
			},
		});
	}

	// Send the actual email
	async send(template, subject) {
		const html = pug.renderFile(`./views/Email/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
		});

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		};

		// 3) Create a transport and send email
		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('Welcome', 'Welcome to the Wardi Family!');
	}

	async Confirmation() {
		await this.send('Confirmation', 'Your link to confirm your email address');
	}

	async sendPasswordReset() {
		await this.send('PasswordReset', 'Your password reset token (valid for only 10 minutes)');
	}
}
