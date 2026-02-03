import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { transporter } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This endpoint should be called by Vercel Cron Job (weekly)
export async function GET() {
  try {
    // Get all providers with their insurance applications
    const providers = await prisma.providers.findMany({
      include: {
        insurance_applications: {
          orderBy: { due_date: 'asc' },
        },
      },
      where: {
        insurance_applications: {
          some: {},
        },
      },
    });

    let emailsSent = 0;

    for (const provider of providers) {
      if (!provider.email || provider.insurance_applications.length === 0) {
        continue;
      }

      const providerName = `${provider.first_name} ${provider.last_name}`;
      const applicationsHtml = provider.insurance_applications
        .map((app) => {
          const dueDate = app.due_date ? new Date(app.due_date) : null;
          const today = new Date();
          const daysUntilDue = dueDate
            ? Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            : null;

          const statusColor =
            daysUntilDue !== null
              ? daysUntilDue < 0
                ? '#d32f2f'
                : daysUntilDue <= 30
                ? '#f57c00'
                : '#4caf50'
              : '#9e9e9e';

          const statusLabel =
            daysUntilDue !== null
              ? daysUntilDue < 0
                ? 'OVERDUE'
                : daysUntilDue <= 30
                ? 'URGENT'
                : 'ON TRACK'
              : 'NO DUE DATE';

          return `
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px; color: #333;">${app.insurance_name}</td>
              <td style="padding: 12px; color: #666;">${
                app.submission_date ? new Date(app.submission_date).toLocaleDateString() : '-'
              }</td>
              <td style="padding: 12px; color: #666;">${
                app.due_date ? new Date(app.due_date).toLocaleDateString() : '-'
              }</td>
              <td style="padding: 12px; color: #666;">${
                daysUntilDue !== null ? `${daysUntilDue} days` : '-'
              }</td>
              <td style="padding: 12px; text-align: center;">
                <span style="background-color: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${statusLabel}
                </span>
              </td>
            </tr>
          `;
        })
        .join('');

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: #800020; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">AllStar Billing Service</h1>
            <p style="margin: 5px 0 0 0;">Insurance Application Status Update</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Dear ${providerName},</p>
            
            <p>We would like to thank you for being an instrumental part of our success and we would like to provide you with the status of your insurance applications.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f5f5f5;">
                    <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #800020;">Insurance Company</th>
                    <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #800020;">Submission Date</th>
                    <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #800020;">Due Date</th>
                    <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #800020;">Days Remaining</th>
                    <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #800020;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${applicationsHtml}
                </tbody>
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>Status Legend:</strong></p>
              <p style="margin: 5px 0 0 0; color: #856404; font-size: 13px;">
                <span style="background-color: #d32f2f; color: white; padding: 2px 6px; border-radius: 3px;">OVERDUE</span> - Action required immediately<br/>
                <span style="background-color: #f57c00; color: white; padding: 2px 6px; border-radius: 3px; margin-top: 3px; display: inline-block;">URGENT</span> - Due within 30 days<br/>
                <span style="background-color: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; margin-top: 3px; display: inline-block;">ON TRACK</span> - On schedule
              </p>
            </div>
            
            <p style="margin-top: 30px;">Please reach out if you have any questions at <strong><a href="mailto:credentialing@allstarbillingservice.com" style="color: #800020;">credentialing@allstarbillingservice.com</a></strong></p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
              <p style="margin: 0; font-size: 12px;">AllStar Billing Service - Credentialing Department</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated weekly status update.</p>
            </div>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'credentialing@allstarbillingservice.com',
          to: provider.email,
          subject: `Weekly Insurance Application Status Update - ${providerName}`,
          html: emailHtml,
        });

        emailsSent++;
      } catch (emailError) {
        console.error(`Error sending email to ${provider.email}:`, emailError);
      }
    }

    return NextResponse.json(
      {
        message: 'Insurance status emails sent',
        emailsSent,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending insurance status emails:', error);
    return NextResponse.json(
      { error: 'Failed to send insurance status emails', details: String(error) },
      { status: 500 }
    );
  }
}
