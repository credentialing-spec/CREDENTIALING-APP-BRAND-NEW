import { prisma } from './db';

// Provider operations
export async function getAllProviders() {
  return await prisma.providers.findMany({
    orderBy: { created_at: 'desc' }
  });
}

export async function getProviderById(id: number) {
  return await prisma.providers.findUnique({
    where: { id }
  });
}

export async function createProvider(providerData: any) {
  return await prisma.providers.create({
    data: providerData
  });
}

export async function updateProvider(id: number, providerData: any) {
  return await prisma.providers.update({
    where: { id },
    data: {
      ...providerData,
      updated_at: new Date()
    }
  });
}

export async function deleteProvider(id: number) {
  // Cascade delete will handle related insurance applications
  await prisma.providers.delete({
    where: { id }
  });
}

// Insurance application operations
export async function getAllInsuranceApplications(providerId?: number) {
  return await prisma.insurance_applications.findMany({
    where: providerId ? { provider_id: providerId } : undefined,
    orderBy: { created_at: 'desc' }
  });
}

export async function getInsuranceApplicationById(id: number) {
  return await prisma.insurance_applications.findUnique({
    where: { id }
  });
}

export async function createInsuranceApplications(providerId: number, applicationsData: any[]) {
  const applications = await Promise.all(
    applicationsData.map(app => 
      prisma.insurance_applications.create({
        data: {
          provider_id: providerId,
          ...app
        }
      })
    )
  );
  return applications;
}

export async function updateInsuranceApplication(id: number, applicationData: any) {
  return await prisma.insurance_applications.update({
    where: { id },
    data: {
      ...applicationData,
      updated_at: new Date()
    }
  });
}

export async function deleteInsuranceApplication(id: number) {
  await prisma.insurance_applications.delete({
    where: { id }
  });
}
