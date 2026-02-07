'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const insuranceStatusOptions = [
  'approved',
  'awaiting info from provider',
  'pending',
  'resubmitted',
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [insuranceApplications, setInsuranceApplications] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [editingInsuranceApp, setEditingInsuranceApp] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    id: 0,
    firstName: '',
    lastName: '',
    middleInitial: '',
    email: '',
    groupName: '',
    individualNPI: '',
    status: 'pending',
    notes: '',
  });
  const [insuranceEditForm, setInsuranceEditForm] = useState({
    id: 0,
    providerId: 0,
    insuranceName: '',
    status: 'pending',
    submissionDate: '',
    dueDate: '',
    methodOfSubmission: '',
    referenceNumber: '',
    providerNumber: '',
    notes: '',
    enteredBy: '',
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchProviders();
      fetchInsuranceApplications();
    }
  }, []);

  const fetchProviders = async () => {
    const response = await fetch('/api/providers');
    if (response.ok) {
      const data = await response.json();
      setProviders(data.providers);
    }
  };

  const normalizeInsuranceApplication = (app: any) => ({
    id: app.id,
    providerId: app.providerId ?? app.provider_id,
    insuranceName: app.insuranceName ?? app.insurance_name ?? '',
    status: app.status ?? 'pending',
    submissionDate: app.submissionDate ?? app.submission_date ?? '',
    dueDate: app.dueDate ?? app.due_date ?? '',
    methodOfSubmission: app.methodOfSubmission ?? app.method_of_submission ?? '',
    referenceNumber: app.referenceNumber ?? app.reference_number ?? '',
    providerNumber: app.providerNumber ?? app.provider_number ?? '',
    notes: app.notes ?? '',
    enteredBy: app.enteredBy ?? app.entered_by ?? '',
  });

  const fetchInsuranceApplications = async () => {
    const response = await fetch('/api/insurance');
    if (response.ok) {
      const data = await response.json();
      const applications = Array.isArray(data.applications) ? data.applications : [];
      setInsuranceApplications(applications.map(normalizeInsuranceApplication));
    }
  };

  const toInputDate = (value: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().split('T')[0];
  };

  const getProviderName = (providerId: number) => {
    const provider = providers.find((item) => item.id === providerId);
    if (!provider) return `Provider #${providerId}`;
    return `${provider.lastName}, ${provider.firstName} ${provider.middleInitial || ''}`.trim();
  };

  const handleStatusUpdate = async (providerId: number, status: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/providers/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchProviders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProvider = async (providerId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this provider?');
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/providers/${providerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete provider');
      }

      await fetchProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
      alert('Error deleting provider. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInsuranceStatusUpdate = async (applicationId: number, status: string) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/insurance/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update insurance status');
      }

      await fetchInsuranceApplications();
    } catch (error) {
      console.error('Error updating insurance status:', error);
      alert('Error updating insurance status. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInsuranceApplication = async (applicationId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this insurance application?');
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/insurance/${applicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete insurance application');
      }

      await fetchInsuranceApplications();
    } catch (error) {
      console.error('Error deleting insurance application:', error);
      alert('Error deleting insurance application. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (provider: any) => {
    setEditForm({
      id: provider.id,
      firstName: provider.firstName || '',
      lastName: provider.lastName || '',
      middleInitial: provider.middleInitial || '',
      email: provider.email || '',
      groupName: provider.groupName || '',
      individualNPI: provider.individualNPI || '',
      status: provider.status || 'pending',
      notes: provider.notes || '',
    });
    setEditingProvider(provider);
  };

  const openInsuranceEdit = (application: any) => {
    setInsuranceEditForm({
      id: application.id,
      providerId: application.providerId,
      insuranceName: application.insuranceName,
      status: application.status || 'pending',
      submissionDate: toInputDate(application.submissionDate),
      dueDate: toInputDate(application.dueDate),
      methodOfSubmission: application.methodOfSubmission || '',
      referenceNumber: application.referenceNumber || '',
      providerNumber: application.providerNumber || '',
      notes: application.notes || '',
      enteredBy: application.enteredBy || '',
    });
    setEditingInsuranceApp(application);
  };

  const closeEdit = () => {
    setEditingProvider(null);
  };

  const closeInsuranceEdit = () => {
    setEditingInsuranceApp(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsuranceEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInsuranceEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/providers/${editingProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          middleInitial: editForm.middleInitial,
          email: editForm.email,
          groupName: editForm.groupName,
          individualNPI: editForm.individualNPI,
          status: editForm.status,
          notes: editForm.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update provider');
      }

      await fetchProviders();
      closeEdit();
    } catch (error) {
      console.error('Error updating provider:', error);
      alert('Error updating provider. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveInsuranceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsuranceApp) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/insurance/${editingInsuranceApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuranceName: insuranceEditForm.insuranceName,
          status: insuranceEditForm.status,
          submissionDate: insuranceEditForm.submissionDate,
          dueDate: insuranceEditForm.dueDate,
          methodOfSubmission: insuranceEditForm.methodOfSubmission,
          referenceNumber: insuranceEditForm.referenceNumber,
          providerNumber: insuranceEditForm.providerNumber,
          notes: insuranceEditForm.notes,
          enteredBy: insuranceEditForm.enteredBy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update insurance application');
      }

      await fetchInsuranceApplications();
      closeInsuranceEdit();
    } catch (error) {
      console.error('Error updating insurance application:', error);
      alert('Error updating insurance application. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Shaunn21$') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchProviders();
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <a
            href="/credentials/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Provider
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Providers</h2>
          {providers.length === 0 ? (
            <p className="text-gray-500">No providers found</p>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg">
                    {provider.lastName}, {provider.firstName} {provider.middleInitial}
                  </h3>
                  <p className="text-sm text-gray-600">{provider.email}</p>
                  <p className="text-sm text-gray-600">Group: {provider.groupName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">NPI: {provider.individualNPI || 'N/A'}</p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                    provider.status === 'approved' ? 'bg-green-100 text-green-800' :
                    provider.status === 'completed' ? 'bg-green-100 text-green-800' :
                    provider.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    provider.status === 'denied' ? 'bg-red-100 text-red-800' :
                    provider.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    provider.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {provider.status || 'pending'}
                  </span>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => handleStatusUpdate(provider.id, 'approved')}
                      disabled={isSaving}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(provider.id, 'rejected')}
                      disabled={isSaving}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(provider.id, 'denied')}
                      disabled={isSaving}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => openEdit(provider)}
                      disabled={isSaving}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => window.open(`/print/provider/${provider.id}`, '_blank')}
                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(provider.id)}
                      disabled={isSaving}
                      className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Insurance Applications</h2>
          {insuranceApplications.length === 0 ? (
            <p className="text-gray-500">No insurance applications found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Insurance</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submission</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Entered By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {insuranceApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        {getProviderName(application.providerId)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {application.insuranceName || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {application.dueDate ? new Date(application.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <select
                          value={application.status || 'pending'}
                          onChange={(e) => handleInsuranceStatusUpdate(application.id, e.target.value)}
                          disabled={isSaving}
                          className="w-full min-w-[220px] px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
                        >
                          {insuranceStatusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {application.enteredBy || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openInsuranceEdit(application)}
                            disabled={isSaving}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInsuranceApplication(application.id)}
                            disabled={isSaving}
                            className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Provider</h2>
              <button
                onClick={closeEdit}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Initial
                  </label>
                  <input
                    type="text"
                    name="middleInitial"
                    value={editForm.middleInitial}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="groupName"
                    value={editForm.groupName}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Individual NPI
                  </label>
                  <input
                    type="text"
                    name="individualNPI"
                    value={editForm.individualNPI}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingInsuranceApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Insurance Application</h2>
                <p className="text-sm text-gray-500">
                  {getProviderName(insuranceEditForm.providerId)}
                </p>
              </div>
              <button
                onClick={closeInsuranceEdit}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveInsuranceEdit} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance Name
                  </label>
                  <input
                    type="text"
                    name="insuranceName"
                    value={insuranceEditForm.insuranceName}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={insuranceEditForm.status}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {insuranceStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Date
                  </label>
                  <input
                    type="date"
                    name="submissionDate"
                    value={insuranceEditForm.submissionDate}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={insuranceEditForm.dueDate}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Method of Submission
                  </label>
                  <input
                    type="text"
                    name="methodOfSubmission"
                    value={insuranceEditForm.methodOfSubmission}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="referenceNumber"
                    value={insuranceEditForm.referenceNumber}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Number
                  </label>
                  <input
                    type="text"
                    name="providerNumber"
                    value={insuranceEditForm.providerNumber}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entered By
                  </label>
                  <input
                    type="text"
                    name="enteredBy"
                    value={insuranceEditForm.enteredBy}
                    onChange={handleInsuranceEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={insuranceEditForm.notes}
                    onChange={handleInsuranceEditChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeInsuranceEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
