'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';

interface Provider {
  id: number;
  firstName: string;
  lastName: string;
  middleInitial: string | null;
  groupName: string | null;
}

interface SavedInsuranceApplication {
  id: number;
  providerId: number;
  insuranceName: string;
  submissionDate: string;
  dueDate: string;
  methodOfSubmission: string;
  referenceNumber: string;
  providerNumber: string;
  notes: string;
  enteredBy: string;
}

export default function InsuranceApplicationsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [savedApplications, setSavedApplications] = useState<SavedInsuranceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [enteredBy, setEnteredBy] = useState<string>('');
  const [editingApp, setEditingApp] = useState<SavedInsuranceApplication | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [insuranceEntries, setInsuranceEntries] = useState<Array<{
    id: number;
    insuranceName: string;
    submissionDate: string;
    dueDate: string;
    methodOfSubmission: string;
    referenceNumber: string;
    providerNumber: string;
    notes: string;
  }>>([]);

  // Fetch providers and insurance applications from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersRes, insuranceRes] = await Promise.all([
          fetch('/api/providers'),
          fetch('/api/insurance')
        ]);
        
        if (providersRes.ok) {
          const data = await providersRes.json();
          setProviders(data.providers);
        } else {
          console.error('Failed to fetch providers');
        }

        if (insuranceRes.ok) {
          const data = await insuranceRes.json();
          setSavedApplications(data.applications);
        } else {
          console.error('Failed to fetch insurance applications');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addInsuranceEntry = () => {
    const newEntry = {
      id: Date.now(),
      insuranceName: '',
      submissionDate: '',
      dueDate: '',
      methodOfSubmission: '',
      referenceNumber: '',
      providerNumber: '',
      notes: '',
    };
    setInsuranceEntries([...insuranceEntries, newEntry]);
  };

  const removeInsuranceEntry = (id: number) => {
    setInsuranceEntries(insuranceEntries.filter(entry => entry.id !== id));
  };

  const updateInsuranceEntry = (id: number, field: string, value: string) => {
    setInsuranceEntries(insuranceEntries.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        
        // Auto-calculate due date when submission date changes
        if (field === 'submissionDate' && value) {
          const submissionDate = new Date(value);
          const dueDate = new Date(submissionDate);
          dueDate.setDate(dueDate.getDate() + 90);
          updatedEntry.dueDate = dueDate.toISOString().split('T')[0];
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvider) {
      alert('Please select a provider before submitting.');
      return;
    }
    
    if (!enteredBy.trim()) {
      alert('Please enter your name before submitting.');
      return;
    }
    
    try {
      const response = await fetch('/api/insurance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          insuranceApplications: insuranceEntries.map(entry => ({
            ...entry,
            enteredBy: enteredBy
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save insurance applications');
      }

      const result = await response.json();
      console.log('Insurance applications saved:', result);
      alert('Insurance applications saved successfully!');
      
      // Refresh the saved applications list
      const insuranceRes = await fetch('/api/insurance');
      if (insuranceRes.ok) {
        const data = await insuranceRes.json();
        setSavedApplications(data.applications);
      }
      
      // Reset form
      setInsuranceEntries([]);
      setSelectedProvider('');
    } catch (error) {
      console.error('Error saving insurance applications:', error);
      alert('Error saving insurance applications. Please try again.');
    }
  };

  const getProviderName = (providerId: number) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return 'Unknown Provider';
    return `${provider.lastName}, ${provider.firstName} ${provider.middleInitial || ''}`.trim();
  };

  const getStatusColor = (dueDate: string) => {
    if (!dueDate) return 'bg-gray-100 text-gray-800';
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'bg-red-100 text-red-800';
    if (daysUntilDue <= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const openEditModal = (app: SavedInsuranceApplication) => {
    setEditingApp(app);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingApp(null);
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!editingApp) return;

    try {
      const response = await fetch(`/api/insurance/${editingApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingApp),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      // Update local state
      setSavedApplications(savedApplications.map(app => 
        app.id === editingApp.id ? editingApp : app
      ));

      alert('Application updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
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
            Insurance Applications
          </h1>
          <p className="text-gray-500 text-lg">
            Track and manage insurance payer enrollment applications
          </p>
        </div>

        {/* Saved Insurance Applications */}
        {savedApplications.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Submitted Applications ({savedApplications.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Insurance Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submission Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entered By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {savedApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        {getProviderName(app.providerId)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {app.insuranceName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.dueDate)}`}>
                          {app.dueDate ? new Date(app.dueDate).toLocaleDateString() : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {app.methodOfSubmission || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {app.providerNumber || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={app.notes}>
                          {app.notes || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {app.enteredBy || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <button
                          onClick={() => openEditModal(app)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit application"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Provider Selection */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Select Provider
              </h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider/Group <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base"
                required
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading providers...' : 'Select a provider or group...'}
                </option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.lastName}, {provider.firstName} {provider.middleInitial || ''} 
                    {provider.groupName ? ` - ${provider.groupName}` : ''}
                  </option>
                ))}
              </select>
              {providers.length === 0 && !loading && (
                <p className="mt-2 text-sm text-amber-600">
                  No providers found. Please add a provider first using the "Add Provider" page.
                </p>
              )}
            </div>
          </div>

          {/* Entered By Field */}
          <div className="mb-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Your Information
              </h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entered By (Your Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={enteredBy}
                onChange={(e) => setEnteredBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-base"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          {/* Insurance Applications Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Insurance Payer Enrollments
                </h3>
              </div>
              <button
                type="button"
                onClick={addInsuranceEntry}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Insurance</span>
              </button>
            </div>

            {insuranceEntries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-emerald-200">
                <svg className="w-16 h-16 text-emerald-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg mb-2">No insurance applications added yet</p>
                <p className="text-sm text-gray-400">Click "Add Insurance" to start tracking insurance payer enrollments</p>
              </div>
            ) : (
              <div className="space-y-6">
                {insuranceEntries.map((entry, index) => (
                  <div key={entry.id} className="bg-white rounded-lg p-6 border border-emerald-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg text-gray-900">Insurance Entry #{index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeInsuranceEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Insurance Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Company Name <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={entry.insuranceName}
                          onChange={(e) => updateInsuranceEntry(entry.id, 'insuranceName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                          required
                        >
                          <option value="">Select Insurance Company</option>
                          <option value="Aetna">Aetna</option>
                          <option value="Ambetter">Ambetter</option>
                          <option value="Anthem">Anthem</option>
                          <option value="BCBS">BCBS (Blue Cross Blue Shield)</option>
                          <option value="Centene">Centene</option>
                          <option value="Cigna">Cigna</option>
                          <option value="Cigna Medicare">Cigna Medicare</option>
                          <option value="Health Net">Health Net</option>
                          <option value="Humana">Humana</option>
                          <option value="Kaiser Permanente">Kaiser Permanente</option>
                          <option value="Medicaid">Medicaid</option>
                          <option value="Medicare">Medicare</option>
                          <option value="Molina">Molina</option>
                          <option value="Multiplan">Multiplan</option>
                          <option value="Optum Physical Health">Optum Physical Health</option>
                          <option value="OptumCare">OptumCare</option>
                          <option value="Presbyterian">Presbyterian</option>
                          <option value="Tricare">Tricare</option>
                          <option value="United Healthcare">United Healthcare</option>
                          <option value="WellCare">WellCare</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Submission Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Submission Date
                        </label>
                        <input
                          type="date"
                          value={entry.submissionDate}
                          onChange={(e) => updateInsuranceEntry(entry.id, 'submissionDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date (90 days from submission)
                        </label>
                        <input
                          type="date"
                          value={entry.dueDate}
                          onChange={(e) => updateInsuranceEntry(entry.id, 'dueDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                        />
                      </div>

                      {/* Method of Submission */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Method of Submission
                        </label>
                        <select
                          value={entry.methodOfSubmission}
                          onChange={(e) => updateInsuranceEntry(entry.id, 'methodOfSubmission', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        >
                          <option value="">Select Method</option>
                          <option value="Email">Email</option>
                          <option value="Fax">Fax</option>
                          <option value="Mail">Mail</option>
                          <option value="Web Submission">Web Submission</option>
                        </select>
                      </div>

                      {/* Reference Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reference/Application Number
                        </label>
                        <input
                          type="text"
                          value={entry.referenceNumber}
                          onChange={(e) => updateInsuranceEntry(entry.id, 'referenceNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter reference or tracking number"
                        />
                      </div>

                      {/* Provider Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provider Number
                        </label>
                        <input
                          type="text"
                          value={entry.providerNumber}
                          onChange={(e) => updateInsuranceEntry(entry.id, 'providerNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter provider number"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={entry.notes}
                        onChange={(e) => updateInsuranceEntry(entry.id, 'notes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Additional notes about this application..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          {insuranceEntries.length > 0 && (
            <div className="flex items-center justify-end space-x-4 pt-8 mt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg"
              >
                Save Insurance Applications
              </button>
            </div>
          )}
        </form>

        {/* Edit Modal */}
        {isEditModalOpen && editingApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Insurance Application</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Provider Name (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <input
                    type="text"
                    value={getProviderName(editingApp.providerId)}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Insurance Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Company</label>
                  <select
                    value={editingApp.insuranceName}
                    onChange={(e) => setEditingApp({ ...editingApp, insuranceName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Aetna">Aetna</option>
                    <option value="Ambetter">Ambetter</option>
                    <option value="Anthem">Anthem</option>
                    <option value="BCBS">BCBS (Blue Cross Blue Shield)</option>
                    <option value="Centene">Centene</option>
                    <option value="Cigna">Cigna</option>
                    <option value="Cigna Medicare">Cigna Medicare</option>
                    <option value="Health Net">Health Net</option>
                    <option value="Humana">Humana</option>
                    <option value="Kaiser Permanente">Kaiser Permanente</option>
                    <option value="Medicaid">Medicaid</option>
                    <option value="Medicare">Medicare</option>
                    <option value="Molina">Molina</option>
                    <option value="Multiplan">Multiplan</option>
                    <option value="Optum Physical Health">Optum Physical Health</option>
                    <option value="OptumCare">OptumCare</option>
                    <option value="Presbyterian">Presbyterian</option>
                    <option value="Tricare">Tricare</option>
                    <option value="United Healthcare">United Healthcare</option>
                    <option value="WellCare">WellCare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Submission Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submission Date</label>
                    <input
                      type="date"
                      value={editingApp.submissionDate}
                      onChange={(e) => setEditingApp({ ...editingApp, submissionDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editingApp.dueDate}
                      onChange={(e) => setEditingApp({ ...editingApp, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Method of Submission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Method of Submission</label>
                    <select
                      value={editingApp.methodOfSubmission}
                      onChange={(e) => setEditingApp({ ...editingApp, methodOfSubmission: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select Method</option>
                      <option value="Email">Email</option>
                      <option value="Fax">Fax</option>
                      <option value="Mail">Mail</option>
                      <option value="Web Submission">Web Submission</option>
                    </select>
                  </div>

                  {/* Reference Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference/Application Number</label>
                    <input
                      type="text"
                      value={editingApp.referenceNumber}
                      onChange={(e) => setEditingApp({ ...editingApp, referenceNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter reference number"
                    />
                  </div>

                  {/* Provider Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provider Number</label>
                    <input
                      type="text"
                      value={editingApp.providerNumber}
                      onChange={(e) => setEditingApp({ ...editingApp, providerNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter provider number"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={editingApp.notes}
                    onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  />
                </div>

                {/* Entered By (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entered By</label>
                  <input
                    type="text"
                    value={editingApp.enteredBy}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-4">
                <button
                  onClick={closeEditModal}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
