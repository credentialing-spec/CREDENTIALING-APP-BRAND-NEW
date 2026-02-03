import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { sendExpirationNotification, ExpiringDocument } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This endpoint should be called by Vercel Cron Job
export async function GET() {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Query providers with expiring documents
    const { rows } = await sql`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        professional_license_expiration_date,
        dea_license_expiration_date,
        certification_expiration_date,
        clia_waiver_expiration_date,
        malpractice_end_date
      FROM providers
      WHERE 
        professional_license_expiration_date BETWEEN ${today.toISOString()} AND ${thirtyDaysFromNow.toISOString()}
        OR dea_license_expiration_date BETWEEN ${today.toISOString()} AND ${thirtyDaysFromNow.toISOString()}
        OR certification_expiration_date BETWEEN ${today.toISOString()} AND ${thirtyDaysFromNow.toISOString()}
        OR clia_waiver_expiration_date BETWEEN ${today.toISOString()} AND ${thirtyDaysFromNow.toISOString()}
        OR malpractice_end_date BETWEEN ${today.toISOString()} AND ${thirtyDaysFromNow.toISOString()}
    `;

    const notifications: ExpiringDocument[] = [];

    for (const provider of rows) {
      const providerName = `${provider.first_name} ${provider.last_name}`;
      const providerEmail = provider.email;

      // Check each document type
      const documents = [
        {
          type: 'Professional License',
          date: provider.professional_license_expiration_date,
        },
        {
          type: 'DEA License',
          date: provider.dea_license_expiration_date,
        },
        {
          type: 'Board Certification',
          date: provider.certification_expiration_date,
        },
        {
          type: 'CLIA Waiver',
          date: provider.clia_waiver_expiration_date,
        },
        {
          type: 'Malpractice Insurance',
          date: provider.malpractice_end_date,
        },
      ];

      for (const doc of documents) {
        if (doc.date) {
          const expirationDate = new Date(doc.date);
          const daysUntilExpiration = Math.ceil(
            (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Send notifications only at specific milestones: 30 days, 7 days, and 1 day before expiration
          const shouldNotify = 
            daysUntilExpiration === 30 || 
            daysUntilExpiration === 7 || 
            daysUntilExpiration === 1;

          if (shouldNotify && daysUntilExpiration >= 0) {
            const notification: ExpiringDocument = {
              providerName,
              providerEmail,
              documentType: doc.type,
              expirationDate: expirationDate.toISOString().split('T')[0],
              daysUntilExpiration,
            };

            notifications.push(notification);

            // Send email notification
            try {
              await sendExpirationNotification(notification);
            } catch (emailError) {
              console.error('Error sending email:', emailError);
            }
          }
        }
      }
    }

    return NextResponse.json(
      {
        message: 'Expiration check completed',
        notificationsSent: notifications.length,
        notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking expirations:', error);
    return NextResponse.json(
      { error: 'Failed to check expirations', details: String(error) },
      { status: 500 }
    );
  }
}
