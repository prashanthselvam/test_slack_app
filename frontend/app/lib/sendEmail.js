import nodemailer from "nodemailer";

// Create a transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "prashanthselvam", // Replace with your Gmail email address
    pass: "LucyLucY2014!", // Replace with your Gmail password
  },
});

// Export the function to send the email
export default async function sendEmail() {
  try {
    // Send the email using the transporter
    const info = await transporter.sendMail({
      from: "PrashanthSelvam", // Replace with your Gmail email address
      to: "prashanthselvam@gmail.com", // Replace with the recipient email address
      subject: "Test Email from Remix App", // Subject of the email
      text: "This is a test email sent from my Remix app!", // Plain text content of the email
    });

    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
}
