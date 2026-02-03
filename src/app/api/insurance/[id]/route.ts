import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch single insurance application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const application = await prisma.insurance_applications.findUnique({
      where: { id }
    });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Insurance application not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ application }, { status: 200 });
  } catch (error) {
    console.error('Error fetching insurance application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insurance application' },
      { status: 500 }
    );
  }
}

// PUT - Update insurance application
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const data = await request.json();
    
    const application = await prisma.insurance_applications.update({
      where: { id },
      data: {
        insurance_name: data.insuranceName,
        submission_date: data.submissionDate ? new Date(data.submissionDate) : null,
        due_date: data.dueDate ? new Date(data.dueDate) : null,
        method_of_submission: data.methodOfSubmission || null,
        reference_number: data.referenceNumber || null,
        provider_number: data.providerNumber || null,
        notes: data.notes || null,
        updated_at: new Date()
      }
    });
    
    return NextResponse.json(
      { message: 'Insurance application updated successfully', application },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating insurance application:', error);
    return NextResponse.json(
      { error: 'Failed to update insurance application' },
      { status: 500 }
    );
  }
}

// DELETE - Delete insurance application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    await prisma.insurance_applications.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'Insurance application deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting insurance application:', error);
    return NextResponse.json(
      { error: 'Failed to delete insurance application' },
      { status: 500 }
    );
  }
}
