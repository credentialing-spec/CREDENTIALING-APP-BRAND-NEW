import { NextRequest, NextResponse } from 'next/server';
import { getProviderById, updateProvider, deleteProvider } from '@/lib/storage';

const parseJsonArray = (value: string | null) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mapProvider = (provider: any) => ({
  id: provider.id,
  lastName: provider.last_name,
  firstName: provider.first_name,
  middleInitial: provider.middle_initial,
  email: provider.email,
  status: provider.status || 'pending',
  groupName: provider.group_name,
  individualNPI: provider.individual_npi,
  individualTaxonomyCode: provider.individual_taxonomy_code,
  dateOfBirth: provider.date_of_birth,
  ssn: provider.ssn,
  caqhNumber: provider.caqh_number,
  notes: provider.notes,
  credentialedInsurances: parseJsonArray(provider.credentialed_insurances),
  desiredInsurances: parseJsonArray(provider.desired_insurances),
  createdAt: provider.created_at,
  updatedAt: provider.updated_at,
});

const buildUpdateData = (data: any) => {
  const updateData: any = {};
  const setIfDefined = (key: string, value: any) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      updateData[key] = value;
    }
  };

  setIfDefined('last_name', data.lastName);
  setIfDefined('first_name', data.firstName);
  setIfDefined('middle_initial', data.middleInitial);
  setIfDefined('email', data.email);
  setIfDefined('group_name', data.groupName);
  setIfDefined('individual_npi', data.individualNPI);
  setIfDefined('status', data.status);
  setIfDefined('notes', data.notes);

  return updateData;
};

// GET - Fetch single provider by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const provider = await getProviderById(id);
    
    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ provider: mapProvider(provider) }, { status: 200 });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    );
  }
}

// PUT - Update provider
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const data = await request.json();
    const updateData = buildUpdateData(data);
    const provider = await updateProvider(id, updateData);

    return NextResponse.json(
      { message: 'Provider updated successfully', provider: mapProvider(provider) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating provider:', error);
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    );
  }
}

// DELETE - Delete provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    await deleteProvider(id);
    
    return NextResponse.json(
      { message: 'Provider deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    );
  }
}
