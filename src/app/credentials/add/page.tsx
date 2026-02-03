'use client';

import { useState } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';

export default function AddProviderPage() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleInitial: '',
    email: '',
    dateOfBirth: '',
    ssn: '',
    cvDocument: '',
    college: '',
    graduationDate: '',
    professionalLicenseNumber: '',
    professionalLicenseState: '',
    professionalLicenseEffectiveDate: '',
    professionalLicenseExpirationDate: '',
    licenseRevokedOrSuspended: '',
    deaLicenseNumber: '',
    deaLicenseState: '',
    deaLicenseIssuanceDate: '',
    deaLicenseExpirationDate: '',
    certificationBoardName: '',
    certificationNumber: '',
    certificationEffectiveDate: '',
    certificationExpirationDate: '',
    individualNPI: '',
    individualTaxonomyCode: '',
    groupNPI: '',
    groupTaxonomyCode: '',
    groupName: '',
    groupTIN: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    faxNumber: '',
    cliaWaiverNumber: '',
    cliaWaiverEffectiveDate: '',
    cliaWaiverExpirationDate: '',
    cliaWaiverDocument: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    voidedCheckDocument: '',
    malpracticeCompany: '',
    malpracticePolicyNumber: '',
    malpracticeStartDate: '',
    malpracticeEndDate: '',
    malpracticeAmount: '',
    caqhNumber: '',
    caqhUsername: '',
    caqhPassword: '',
    notes: '',
    priorCredentialing: '',
    credentialedInsurances: [] as string[],
    desiredInsurances: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (insuranceName: string) => {
    setFormData((prev) => {
      const isChecked = prev.credentialedInsurances.includes(insuranceName);
      return {
        ...prev,
        credentialedInsurances: isChecked
          ? prev.credentialedInsurances.filter((name) => name !== insuranceName)
          : [...prev.credentialedInsurances, insuranceName],
      };
    });
  };

  const handleDesiredInsuranceChange = (insuranceName: string) => {
    setFormData((prev) => {
      const isChecked = prev.desiredInsurances.includes(insuranceName);
      return {
        ...prev,
        desiredInsurances: isChecked
          ? prev.desiredInsurances.filter((name) => name !== insuranceName)
          : [...prev.desiredInsurances, insuranceName],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save provider');
      }

      const result = await response.json();
      
      alert(`Provider added successfully! Provider ID: ${result.providerId}`);
      
      // Reset form
      setFormData({
        lastName: '',
        firstName: '',
        middleInitial: '',
        email: '',
        dateOfBirth: '',
        ssn: '',
        cvDocument: '',
        college: '',
        graduationDate: '',
        professionalLicenseNumber: '',
        professionalLicenseState: '',
        professionalLicenseEffectiveDate: '',
        professionalLicenseExpirationDate: '',
        licenseRevokedOrSuspended: '',
        deaLicenseNumber: '',
        deaLicenseState: '',
        deaLicenseIssuanceDate: '',
        deaLicenseExpirationDate: '',
        certificationBoardName: '',
        certificationNumber: '',
        certificationEffectiveDate: '',
        certificationExpirationDate: '',
        individualNPI: '',
        individualTaxonomyCode: '',
        groupNPI: '',
        groupTaxonomyCode: '',
        groupName: '',
        groupTIN: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        faxNumber: '',
        cliaWaiverNumber: '',
        cliaWaiverEffectiveDate: '',
        cliaWaiverExpirationDate: '',
        cliaWaiverDocument: '',
        bankName: '',
        routingNumber: '',
        accountNumber: '',
        voidedCheckDocument: '',
        malpracticeCompany: '',
        malpracticePolicyNumber: '',
        malpracticeStartDate: '',
        malpracticeEndDate: '',
        malpracticeAmount: '',
        caqhNumber: '',
        caqhUsername: '',
        caqhPassword: '',
        notes: '',
        priorCredentialing: '',
        credentialedInsurances: [],
        desiredInsurances: [],
      });
    } catch (error) {
      console.error('Error saving provider:', error);
      alert('Error saving provider. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="AllStar Billing Service Logo"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-[#800020] mb-3">
            Credentialing Intake Form
          </h1>
          <p className="text-gray-500 text-lg">
            Complete the form below to add credentialing information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Initial
                </label>
                <input
                  type="text"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  placeholder="XXX-XX-XXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CV/Resume
                </label>
                <input
                  type="file"
                  name="cvDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, cvDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Education Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical School/College
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Date
                </label>
                <input
                  type="date"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Degree/CV
                </label>
                <input
                  type="file"
                  name="cvDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, cvDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Professional License */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border border-teal-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Professional License</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="professionalLicenseNumber"
                  value={formData.professionalLicenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="professionalLicenseState"
                  value={formData.professionalLicenseState}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="professionalLicenseEffectiveDate"
                  value={formData.professionalLicenseEffectiveDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="professionalLicenseExpirationDate"
                  value={formData.professionalLicenseExpirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Has your license ever been revoked and/or suspended?
                </label>
                <select
                  name="licenseRevokedOrSuspended"
                  value={formData.licenseRevokedOrSuspended}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="">Select an option</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Professional License
                </label>
                <input
                  type="file"
                  name="professionalLicenseDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, professionalLicenseDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>
            </div>
          </div>

          {/* DEA License */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-6 border border-orange-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">DEA License</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DEA Number
                </label>
                <input
                  type="text"
                  name="deaLicenseNumber"
                  value={formData.deaLicenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="deaLicenseState"
                  value={formData.deaLicenseState}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuance Date
                </label>
                <input
                  type="date"
                  name="deaLicenseIssuanceDate"
                  value={formData.deaLicenseIssuanceDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="deaLicenseExpirationDate"
                  value={formData.deaLicenseExpirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Professional License
                </label>
                <input
                  type="file"
                  name="professionalLicenseDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, professionalLicenseDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Board Certifications */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 mb-6 border border-indigo-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Board Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  name="certificationBoardName"
                  value={formData.certificationBoardName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Number
                </label>
                <input
                  type="text"
                  name="certificationNumber"
                  value={formData.certificationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="certificationEffectiveDate"
                  value={formData.certificationEffectiveDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="certificationExpirationDate"
                  value={formData.certificationExpirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Board Certification
                </label>
                <input
                  type="file"
                  name="certificationDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, certificationDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>
            </div>
          </div>

          {/* NPI */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">NPI Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Individual NPI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="individualNPI"
                  value={formData.individualNPI}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Individual Taxonomy Code
                </label>
                <input
                  type="text"
                  name="individualTaxonomyCode"
                  value={formData.individualTaxonomyCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="e.g., 207Q00000X"
                />
              </div>
            </div>
          </div>

          {/* Group Information */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 mb-6 border border-rose-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Group Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group NPI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="groupNPI"
                  value={formData.groupNPI}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Taxonomy Code
                </label>
                <input
                  type="text"
                  name="groupTaxonomyCode"
                  value={formData.groupTaxonomyCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="e.g., 207Q00000X"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID (TIN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="groupTIN"
                  value={formData.groupTIN}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fax Number
                </label>
                <input
                  type="tel"
                  name="faxNumber"
                  value={formData.faxNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Street address, P.O. box"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select State</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  maxLength={10}
                  placeholder="e.g., 12345 or 12345-6789"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload W-9 Form
                </label>
                <input
                  type="file"
                  name="w9Document"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, w9Document: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>

              {/* CLIA Waiver Section */}
              <div className="md:col-span-2 border-t border-rose-200 pt-4 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">CLIA Waiver Information</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CLIA Waiver Number
                </label>
                <input
                  type="text"
                  name="cliaWaiverNumber"
                  value={formData.cliaWaiverNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter CLIA waiver number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CLIA Waiver Effective Date
                </label>
                <input
                  type="date"
                  name="cliaWaiverEffectiveDate"
                  value={formData.cliaWaiverEffectiveDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CLIA Waiver Expiration Date
                </label>
                <input
                  type="date"
                  name="cliaWaiverExpirationDate"
                  value={formData.cliaWaiverExpirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CLIA Waiver
                </label>
                <input
                  type="file"
                  name="cliaWaiverDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, cliaWaiverDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>

              {/* Banking Information Section */}
              <div className="md:col-span-2 border-t border-rose-200 pt-4 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="9-digit routing number"
                  maxLength={9}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter account number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Voided Check
                </label>
                <input
                  type="file"
                  name="voidedCheckDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, voidedCheckDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Malpractice Insurance */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Malpractice Insurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Company
                </label>
                <input
                  type="text"
                  name="malpracticeCompany"
                  value={formData.malpracticeCompany}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Number
                </label>
                <input
                  type="text"
                  name="malpracticePolicyNumber"
                  value={formData.malpracticePolicyNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Start Date
                </label>
                <input
                  type="date"
                  name="malpracticeStartDate"
                  value={formData.malpracticeStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy End Date
                </label>
                <input
                  type="date"
                  name="malpracticeEndDate"
                  value={formData.malpracticeEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Amount
                </label>
                <input
                  type="text"
                  name="malpracticeAmount"
                  value={formData.malpracticeAmount}
                  onChange={handleChange}
                  placeholder="e.g., $1,000,000/$3,000,000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Malpractice Insurance Certificate
                </label>
                <input
                  type="file"
                  name="malpracticeDocument"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, malpracticeDocument: file.name }));
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                />
                <p className="mt-1 text-sm text-gray-500">PDF, JPG, JPEG, or PNG (Max 10MB)</p>
              </div>
            </div>
          </div>

          {/* CAQH Information */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border border-amber-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">CAQH Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CAQH Number
                </label>
                <input
                  type="text"
                  name="caqhNumber"
                  value={formData.caqhNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CAQH Username
                </label>
                <input
                  type="text"
                  name="caqhUsername"
                  value={formData.caqhUsername}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CAQH Password
                </label>
                <input
                  type="password"
                  name="caqhPassword"
                  value={formData.caqhPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Miscellaneous Information */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 mb-6 border border-violet-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Miscellaneous Information</h3>
            <div className="space-y-6">
              {/* Prior Credentialing Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Have you ever been credentialed with any insurance companies?
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priorCredentialing"
                      value="no"
                      checked={formData.priorCredentialing === 'no'}
                      onChange={handleChange}
                      className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priorCredentialing"
                      value="yes"
                      checked={formData.priorCredentialing === 'yes'}
                      onChange={handleChange}
                      className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                </div>
              </div>

              {/* Insurance Companies Checkboxes - Show only if Yes */}
              {formData.priorCredentialing === 'yes' && (
                <div className="bg-white rounded-lg p-6 border border-violet-200">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Select the insurance companies you have been credentialed with:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      'Aetna',
                      'BCBS',
                      'Cigna',
                      'Medicaid',
                      'Medicare',
                      'Molina',
                      'Presbyterian',
                      'UHC',
                    ].map((insurance) => (
                      <label
                        key={insurance}
                        className="flex items-center space-x-2 p-2 hover:bg-violet-50 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.credentialedInsurances.includes(insurance)}
                          onChange={() => handleCheckboxChange(insurance)}
                          className="w-4 h-4 text-violet-600 focus:ring-violet-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{insurance}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Desired Credentialing Question */}
              <div className="border-t border-violet-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Which insurance companies would you like to be credentialed with?
                </label>
                <div className="bg-white rounded-lg p-6 border border-violet-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      'Aetna',
                      'BCBS',
                      'Cigna',
                      'Medicaid',
                      'Medicare',
                      'Molina',
                      'Presbyterian',
                      'UHC',
                    ].map((insurance) => (
                      <label
                        key={insurance}
                        className="flex items-center space-x-2 p-2 hover:bg-violet-50 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.desiredInsurances.includes(insurance)}
                          onChange={() => handleDesiredInsuranceChange(insurance)}
                          className="w-4 h-4 text-violet-600 focus:ring-violet-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{insurance}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder="Additional notes, comments, or other relevant information..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use this section to add any additional information that doesn't fit in the categories above.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[#800020] to-[#a0002a] text-white rounded-xl hover:from-[#6a001a] hover:to-[#800020] transition-all duration-200 font-semibold shadow-lg"
            >
              Save Provider
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
