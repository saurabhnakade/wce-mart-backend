const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			service: "gmail",
			port: 587,
			secure: true,
			auth: {
				user: "saurabh.nakade@walchandsangli.ac.in",
				pass: "saurabh2309",
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
		});
	} catch (error) {
		console.log(error);
		return error;
	}
};