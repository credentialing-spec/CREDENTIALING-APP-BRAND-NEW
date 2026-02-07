import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch all insurance applications (optionally filter by provider)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    
    const applications = await prisma.insurance_applications.findMany({
      where: providerId ? { provider_id: parseInt(providerId) } : undefined,
      orderBy: { created_at: 'desc' }
    });
    
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching insurance applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insurance applications' },
      { status: 500 }
    );
  }
}

// POST - Create new insurance application(s)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { providerId, insuranceApplications } = data;
    
    if (!providerId || !insuranceApplications || !Array.isArray(insuranceApplications)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    const applications = await Promise.all(
      insuranceApplications.map(app => 
        prisma.insurance_applications.create({
          data: {
            provider_id: parseInt(providerId),
            insurance_name: app.insuranceName,
            status: app.status || 'pending',
            submission_date: app.submissionDate ? new Date(app.submissionDate) : null,
            due_date: app.dueDate ? new Date(app.dueDate) : null,
            method_of_submission: app.methodOfSubmission || null,
            reference_number: app.referenceNumber || null,
            provider_number: app.providerNumber || null,
            notes: app.notes || null,
            entered_by: app.enteredBy || null
          }
        })
      )
    );
    
    return NextResponse.json(
      { 
        message: 'Insurance applications created successfully',
        applications
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating insurance applications:', error);
    return NextResponse.json(
      { error: 'Failed to create insurance applications' },
      { status: 500 }
    );
  }
}
