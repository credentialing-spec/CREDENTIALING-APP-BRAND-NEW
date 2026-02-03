import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
  dateOfBirth: provider.date_of_birth,
  ssn: provider.ssn,
  cvDocument: provider.cv_document,
  college: provider.college,
  graduationDate: provider.graduation_date,
  professionalLicenseNumber: provider.professional_license_number,
  professionalLicenseState: provider.professional_license_state,
  professionalLicenseEffectiveDate: provider.professional_license_effective_date,
  professionalLicenseExpirationDate: provider.professional_license_expiration_date,
  licenseRevokedOrSuspended: provider.license_revoked_or_suspended,
  deaLicenseNumber: provider.dea_license_number,
  deaLicenseState: provider.dea_license_state,
  deaLicenseIssuanceDate: provider.dea_license_issuance_date,
  deaLicenseExpirationDate: provider.dea_license_expiration_date,
  certificationBoardName: provider.certification_board_name,
  certificationNumber: provider.certification_number,
  certificationEffectiveDate: provider.certification_effective_date,
  certificationExpirationDate: provider.certification_expiration_date,
  individualNPI: provider.individual_npi,
  individualTaxonomyCode: provider.individual_taxonomy_code,
  groupNPI: provider.group_npi,
  groupTaxonomyCode: provider.group_taxonomy_code,
  groupName: provider.group_name,
  groupTIN: provider.group_tin,
  addressLine1: provider.address_line1,
  addressLine2: provider.address_line2,
  city: provider.city,
  state: provider.state,
  zipCode: provider.zip_code,
  phoneNumber: provider.phone_number,
  faxNumber: provider.fax_number,
  cliaWaiverNumber: provider.clia_waiver_number,
  cliaWaiverEffectiveDate: provider.clia_waiver_effective_date,
  cliaWaiverExpirationDate: provider.clia_waiver_expiration_date,
  cliaWaiverDocument: provider.clia_waiver_document,
  bankName: provider.bank_name,
  routingNumber: provider.routing_number,
  accountNumber: provider.account_number,
  voidedCheckDocument: provider.voided_check_document,
  malpracticeCompany: provider.malpractice_company,
  malpracticePolicyNumber: provider.malpractice_policy_number,
  malpracticeStartDate: provider.malpractice_start_date,
  malpracticeEndDate: provider.malpractice_end_date,
  malpracticeAmount: provider.malpractice_amount,
  caqhNumber: provider.caqh_number,
  caqhUsername: provider.caqh_username,
  caqhPassword: provider.caqh_password,
  notes: provider.notes,
  priorCredentialing: provider.prior_credentialing,
  credentialedInsurances: parseJsonArray(provider.credentialed_insurances),
  desiredInsurances: parseJsonArray(provider.desired_insurances),
  createdAt: provider.created_at,
  updatedAt: provider.updated_at,
});

// GET - Fetch all providers
export async function GET() {
  try {
    const providers = await prisma.providers.findMany({
      orderBy: { created_at: 'desc' }
    });
    const mappedProviders = providers.map(mapProvider);
    return NextResponse.json({ providers: mappedProviders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}

// POST - Create a new provider
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const provider = await prisma.providers.create({
      data: {
        last_name: data.lastName,
        first_name: data.firstName,
        middle_initial: data.middleInitial || null,
        email: data.email,
        status: data.status || 'pending',
        date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        ssn: data.ssn || null,
        cv_document: data.cvDocument || null,
        college: data.college || null,
        graduation_date: data.graduationDate ? new Date(data.graduationDate) : null,
        professional_license_number: data.professionalLicenseNumber || null,
        professional_license_state: data.professionalLicenseState || null,
        professional_license_effective_date: data.professionalLicenseEffectiveDate ? new Date(data.professionalLicenseEffectiveDate) : null,
        professional_license_expiration_date: data.professionalLicenseExpirationDate ? new Date(data.professionalLicenseExpirationDate) : null,
        license_revoked_or_suspended: data.licenseRevokedOrSuspended || null,
        dea_license_number: data.deaLicenseNumber || null,
        dea_license_state: data.deaLicenseState || null,
        dea_license_issuance_date: data.deaLicenseIssuanceDate ? new Date(data.deaLicenseIssuanceDate) : null,
        dea_license_expiration_date: data.deaLicenseExpirationDate ? new Date(data.deaLicenseExpirationDate) : null,
        certification_board_name: data.certificationBoardName || null,
        certification_number: data.certificationNumber || null,
        certification_effective_date: data.certificationEffectiveDate ? new Date(data.certificationEffectiveDate) : null,
        certification_expiration_date: data.certificationExpirationDate ? new Date(data.certificationExpirationDate) : null,
        individual_npi: data.individualNPI || null,
        individual_taxonomy_code: data.individualTaxonomyCode || null,
        group_npi: data.groupNPI || null,
        group_taxonomy_code: data.groupTaxonomyCode || null,
        group_name: data.groupName || null,
        group_tin: data.groupTIN || null,
        address_line1: data.addressLine1 || null,
        address_line2: data.addressLine2 || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zipCode || null,
        phone_number: data.phoneNumber || null,
        fax_number: data.faxNumber || null,
        clia_waiver_number: data.cliaWaiverNumber || null,
        clia_waiver_effective_date: data.cliaWaiverEffectiveDate ? new Date(data.cliaWaiverEffectiveDate) : null,
        clia_waiver_expiration_date: data.cliaWaiverExpirationDate ? new Date(data.cliaWaiverExpirationDate) : null,
        clia_waiver_document: data.cliaWaiverDocument || null,
        bank_name: data.bankName || null,
        routing_number: data.routingNumber || null,
        account_number: data.accountNumber || null,
        voided_check_document: data.voidedCheckDocument || null,
        malpractice_company: data.malpracticeCompany || null,
        malpractice_policy_number: data.malpracticePolicyNumber || null,
        malpractice_start_date: data.malpracticeStartDate ? new Date(data.malpracticeStartDate) : null,
        malpractice_end_date: data.malpracticeEndDate ? new Date(data.malpracticeEndDate) : null,
        malpractice_amount: data.malpracticeAmount || null,
        caqh_number: data.caqhNumber || null,
        caqh_username: data.caqhUsername || null,
        caqh_password: data.caqhPassword || null,
        notes: data.notes || null,
        prior_credentialing: data.priorCredentialing || null,
        credentialed_insurances: data.credentialedInsurances ? JSON.stringify(data.credentialedInsurances) : null,
        desired_insurances: data.desiredInsurances ? JSON.stringify(data.desiredInsurances) : null
      }
    });
    
    return NextResponse.json(
      { 
        message: 'Provider created successfully',
        providerId: provider.id,
        provider
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating provider:', error);
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    );
  }
}
