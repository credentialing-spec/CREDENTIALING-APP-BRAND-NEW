import { NextResponse } from 'next/server';
import { sendExpirationNotification } from '@/lib/email';

export async function GET() {
  try {
    // Send a test notification
    await sendExpirationNotification({
      providerName: 'Test Provider',
      providerEmail: 'credentialing@allstarbillingservice.com',
      documentType: 'Professional License',
      expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysUntilExpiration: 25,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Test email sent successfully to credentialing@allstarbillingservice.com',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test email',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
