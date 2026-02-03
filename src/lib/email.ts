import nodemailer from 'nodemailer';

// Create reusable transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface ExpiringDocument {
  providerName: string;
  providerEmail: string;
  documentType: string;
  expirationDate: string;
  daysUntilExpiration: number;
}

export async function sendExpirationNotification(document: ExpiringDocument) {
  const { providerName, providerEmail, documentType, expirationDate, daysUntilExpiration } = document;
  
  const formattedDate = new Date(expirationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determine urgency level and styling
  const urgencyLevel = 
    daysUntilExpiration <= 1 ? 'URGENT' :
    daysUntilExpiration <= 7 ? 'IMPORTANT' :
    'NOTICE';
  
  const urgencyColor = 
    daysUntilExpiration <= 1 ? '#d32f2f' :
    daysUntilExpiration <= 7 ? '#f57c00' :
    '#800020';

  // Email to credentialing team
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@allstarbillingservice.com',
    to: 'credentialing@allstarbillingservice.com',
    subject: `${urgencyLevel}: Document Expiration - ${providerName} - ${documentType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${urgencyColor}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">AllStar Billing Service</h1>
          <p style="margin: 5px 0 0 0;">${urgencyLevel}: Document Expiration Alert</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: ${urgencyColor}; margin-top: 0;">Attention Required</h2>
          
          <p>The following document is expiring soon:</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid ${urgencyColor}; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Provider:</strong> ${providerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${providerEmail}</p>
            <p style="margin: 5px 0;"><strong>Document Type:</strong> ${documentType}</p>
            <p style="margin: 5px 0;"><strong>Expiration Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0; color: ${urgencyColor}; font-size: 18px;"><strong>Days Until Expiration: ${daysUntilExpiration}</strong></p>
          </div>
          
          <p>Please contact the provider to obtain an updated document.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 12px;">This is an automated notification from your credentialing system.</p>
          </div>
        </div>
      </div>
    `
  });

  // Email to provider
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'credentialing@allstarbillingservice.com',
    to: providerEmail,
    subject: `${urgencyLevel}: Document Expiration Reminder - ${documentType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${urgencyColor}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">AllStar Billing Service</h1>
          <p style="margin: 5px 0 0 0;">${urgencyLevel}: Document Expiration Reminder</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p>Dear ${providerName},</p>
          
          <p>This is ${daysUntilExpiration === 1 ? 'an urgent' : 'a'} reminder that one of your credentialing documents is expiring soon.</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid ${urgencyColor}; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Document Type:</strong> ${documentType}</p>
            <p style="margin: 5px 0;"><strong>Expiration Date:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0; color: ${urgencyColor}; font-size: 18px;"><strong>Days Until Expiration: ${daysUntilExpiration}</strong></p>
          </div>
          
          <p><strong>To avoid any disruption in your credentialing status, please provide an updated document as soon as possible.</strong></p>
          
          <p>If you have already submitted an updated document, please disregard this notice.</p>
          
          <p style="margin-top: 30px;">
            <strong>Questions?</strong><br>
            Contact us at: <a href="mailto:credentialing@allstarbillingservice.com" style="color: ${urgencyColor};">credentialing@allstarbillingservice.com</a>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p style="margin: 0; font-size: 12px;">AllStar Billing Service - Credentialing Department</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `
  });
}
