import nodemailer from "nodemailer";

export async function sendContactEmail(req, res) {
  const { name, email, message } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  console.log("Email:", email);
  console.log("Name:", name);
  console.log("Message:", message);
  // create transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD // your Gmail app password
    }
  });

  // email template for user (auto-reply template)
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Thank you for contacting us - ShoobEstate",
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out to us. We have received your message and will get back to you shortly.</p>
      <p>Here's a copy of your message:</p>
      <p><em>${message}</em></p>
      <br>
      <p>Best regards,</p>
      <p>Shoob Estate Team</p>
    `
  };

  // e-mail template for admin/host
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // your admin email (shuvadiptadas8820@gmail.com)
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    // Send email to user
    await transporter.sendMail(userMailOptions);
    
    // Send email to admin
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ 
      success: true, 
      message: "Thank you for your message. We will get back to you soon!" 
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email. Please try again later." 
    });
  }
}