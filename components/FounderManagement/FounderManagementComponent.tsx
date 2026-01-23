'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchFounders,
  createFounder,
  updateFounder,
  deleteFounder,
  Founder,
  validateFounder,
  calculateFounderStats,
  formatAmount,
  calculateRemainingEquity,
} from '@/lib/finance/founders';

interface EditingFounder extends Partial<Founder> {
  isNew?: boolean;
}

export default function FounderManagementComponent() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<EditingFounder | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load founders on mount
  useEffect(() => {
    loadFounders();
  }, []);

  const loadFounders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFounders();
      setFounders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load founders');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (founder: Founder) => {
    setEditingId(founder.id);
    setEditingData({ ...founder });
    setValidationErrors([]);
  };

  const handleNewForm = () => {
    setShowNewForm(true);
    setEditingData({
      isNew: true,
      profitSharePercentage: 50,
      status: 'active',
    } as EditingFounder);
    setValidationErrors([]);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData(null);
    setShowNewForm(false);
    setValidationErrors([]);
  };

  const handleSave = async () => {
    if (!editingData) return;

    // Validate
    const errors = validateFounder(editingData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setError(null);

      if (editingData.isNew) {
        await createFounder(editingData);
      } else if (editingId) {
        await updateFounder(editingId, editingData);
      }

      await loadFounders();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save founder');
    }
  };

  const handleDelete = async (founderId: string) => {
    if (!confirm('Are you sure you want to delete this founder?')) return;

    try {
      setError(null);
      await deleteFounder(founderId);
      await loadFounders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete founder');
    }
  };

  const stats = calculateFounderStats(founders);
  const remainingEquity = calculateRemainingEquity(founders);

  if (loading) {
    return <div className="p-6 text-center">Loading founders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Founder Management</h2>
        <button
          onClick={handleNewForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Founder
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Founders</p>
          <p className="text-2xl font-bold">{stats.totalFounders}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold">{stats.activeFounders}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Equity</p>
          <p className="text-2xl font-bold">{stats.totalEquity}%</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Remaining</p>
          <p className="text-2xl font-bold">{remainingEquity}%</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* New Founder Form */}
      {showNewForm && editingData?.isNew && (
        <div className="p-6 bg-gray-50 rounded-lg border-2 border-blue-300">
          <h3 className="text-lg font-semibold mb-4">Create New Founder</h3>
          <FounderForm
            data={editingData}
            onChange={setEditingData}
            onSave={handleSave}
            onCancel={handleCancel}
            errors={validationErrors}
          />
        </div>
      )}

      {/* Founders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-center font-semibold">Equity %</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
              <th className="px-4 py-3 text-center font-semibold">Joined</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {founders.map((founder, idx) => (
              <React.Fragment key={founder.id}>
                {editingId === founder.id ? (
                  <tr className="bg-blue-50 border-b-2 border-blue-200">
                    <td colSpan={7} className="p-4">
                      <FounderForm
                        data={editingData || founder}
                        onChange={setEditingData}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        errors={validationErrors}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium">{founder.name}</td>
                    <td className="px-4 py-3 text-sm">{founder.email || '-'}</td>
                    <td className="px-4 py-3 text-sm">{founder.phone || '-'}</td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {founder.profitSharePercentage}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          founder.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {founder.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {new Date(founder.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(founder)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(founder.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {founders.length === 0 && !showNewForm && (
        <div className="p-8 text-center text-gray-500">
          No founders yet. Click "Add Founder" to create one.
        </div>
      )}
    </div>
  );
}

interface FounderFormProps {
  data: EditingFounder;
  onChange: (data: EditingFounder) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  errors: string[];
}

function FounderForm({ data, onChange, onSave, onCancel, errors }: FounderFormProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          <ul className="list-disc list-inside">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Founder name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@megicode.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+92-300-0000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Equity Share % *</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.profitSharePercentage || 0}
            onChange={(e) => onChange({ ...data, profitSharePercentage: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={data.status || 'active'}
            onChange={(e) => onChange({ ...data, status: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Joined Date</label>
          <input
            type="date"
            value={
              data.joinedAt
                ? new Date(data.joinedAt).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
            }
            onChange={(e) => onChange({ ...data, joinedAt: new Date(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any notes about this founder"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
