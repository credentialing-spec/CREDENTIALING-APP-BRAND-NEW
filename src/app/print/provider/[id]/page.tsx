'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Provider {
  id: number;
  firstName: string;
  lastName: string;
  middleInitial: string | null;
  email: string;
  groupName: string | null;
  individualNPI: string | null;
  individualTaxonomyCode: string | null;
  dateOfBirth: string | null;
  ssn: string | null;
  caqhNumber: string | null;
  professionalLicenseEffectiveDate: string | null;
  professionalLicenseExpirationDate: string | null;
  deaLicenseIssuanceDate: string | null;
  deaLicenseExpirationDate: string | null;
  certificationEffectiveDate: string | null;
  certificationExpirationDate: string | null;
  cliaWaiverEffectiveDate: string | null;
  cliaWaiverExpirationDate: string | null;
  malpracticeStartDate: string | null;
  malpracticeEndDate: string | null;
  status: string;
}

export default function PrintProviderPage() {
  const params = useParams();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await fetch(`/api/providers/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProvider(data.provider);
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProvider();
    }
  }, [id]);

  useEffect(() => {
    if (provider) {
      window.print();
    }
  }, [provider]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!provider) {
    return <div className="p-8 text-center">Provider not found</div>;
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiration = (date: string | null) => {
    if (!date) return null;
    const expirationDate = new Date(date);
    const today = new Date();
    const daysUntil = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  const getExpirationStatus = (days: number | null) => {
    if (days === null) return '';
    if (days < 0) return '(EXPIRED)';
    if (days <= 30) return `(${days} days - URGENT)`;
    if (days <= 90) return `(${days} days - REVIEW SOON)`;
    return `(${days} days)`;
  };

  return (
    <div className="p-8 max-w-8.5in mx-auto bg-white">
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print-container {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold">AllStar Billing Service</h1>
          <p className="text-sm text-gray-600">Provider Information Sheet</p>
          <p className="text-xs text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString('en-US')}
          </p>
        </div>

        {/* Provider Information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 pb-2 mb-3">
            Provider Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
              <p className="text-sm font-semibold">
                {provider.lastName}, {provider.firstName}{' '}
                {provider.middleInitial && provider.middleInitial}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Status</p>
              <p className="text-sm font-semibold capitalize">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    provider.status === 'approved' ? 'bg-green-200 text-green-800' :
                    provider.status === 'completed' ? 'bg-green-200 text-green-800' :
                    provider.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    provider.status === 'denied' ? 'bg-red-200 text-red-800' :
                    provider.status === 'in-progress' ? 'bg-yellow-200 text-yellow-800' :
                    provider.status === 'on-hold' ? 'bg-orange-200 text-orange-800' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {provider.status || 'Pending'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
              <p className="text-sm">{provider.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Individual NPI</p>
              <p className="text-sm">{provider.individualNPI || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Taxonomy Code</p>
              <p className="text-sm">{provider.individualTaxonomyCode || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">CAQH Number</p>
              <p className="text-sm">{provider.caqhNumber || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">Date of Birth</p>
              <p className="text-sm">{formatDate(provider.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase">SSN</p>
              <p className="text-sm">{provider.ssn || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">Group Name</p>
              <p className="text-sm">{provider.groupName || '-'}</p>
            </div>
          </div>
        </div>

        {/* Document Expiration Dates */}
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-gray-400 pb-2 mb-3">
            Document Dates
          </h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  Document Type
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  Effective Date
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  Expiration Date
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Professional License</td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.professionalLicenseEffectiveDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.professionalLicenseExpirationDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {getExpirationStatus(
                    getDaysUntilExpiration(provider.professionalLicenseExpirationDate)
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">DEA License</td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.deaLicenseIssuanceDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.deaLicenseExpirationDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {getExpirationStatus(
                    getDaysUntilExpiration(provider.deaLicenseExpirationDate)
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Board Certification</td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.certificationEffectiveDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.certificationExpirationDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {getExpirationStatus(
                    getDaysUntilExpiration(provider.certificationExpirationDate)
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">CLIA Waiver</td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.cliaWaiverEffectiveDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.cliaWaiverExpirationDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {getExpirationStatus(
                    getDaysUntilExpiration(provider.cliaWaiverExpirationDate)
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2">Malpractice Insurance</td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.malpracticeStartDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {formatDate(provider.malpracticeEndDate)}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {getExpirationStatus(getDaysUntilExpiration(provider.malpracticeEndDate))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center pt-8 border-t border-gray-300">
          <p>This is a confidential document. For internal use only.</p>
          <p>Page generated by Credentialing Management System</p>
        </div>
      </div>
    </div>
  );
}
