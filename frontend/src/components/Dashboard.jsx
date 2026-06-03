import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiUser, FiInfo, FiTrendingUp, FiCheckCircle, FiFileText } from 'react-icons/fi';
import LeadDetails from './LeadDetails';

const Dashboard = ({ token, onLogout, onShowDocs, backendUrl }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedLead, setSelectedLead] = useState(null);
  const [sources, setSources] = useState([]);

  // Fetch leads from backend
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        source: sourceFilter,
        search: search,
        sort: sortOrder
      });

      const response = await fetch(`${backendUrl}/api/leads?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve leads');
      }

      const data = await response.json();
      setLeads(data);

      // Extract unique sources for the filter option list if we are viewing all
      if (statusFilter === 'all' && sourceFilter === 'all' && search === '') {
        const uniqueSources = [...new Set(data.map(lead => lead.source || 'Website'))];
        setSources(uniqueSources);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filter options change
  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, sortOrder, token]);

  // Debounced/Triggered search handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  // Status badges mapping
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return <span className="badge badge-new">New</span>;
      case 'Contacted':
        return <span className="badge badge-contacted">Contacted</span>;
      case 'Converted':
        return <span className="badge badge-converted">Converted</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  // Metrics calculation
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  const handleUpdateLead = (updatedLead) => {
    // Update local state leads
    setLeads(prevLeads => prevLeads.map(l => l._id === updatedLead._id ? updatedLead : l));
    // Update currently viewed lead
    setSelectedLead(updatedLead);
  };

  const handleDeleteLead = (deletedId) => {
    setLeads(prevLeads => prevLeads.filter(l => l._id !== deletedId));
    setSelectedLead(null);
  };

  return (
    <div className="fade-in">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="glass-card metric-card">
          <div className="metric-icon indigo">
            <FiUser />
          </div>
          <div className="metric-info">
            <h3>Total Leads</h3>
            <p>{totalLeads}</p>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon amber">
            <FiInfo />
          </div>
          <div className="metric-info">
            <h3>New</h3>
            <p>{newLeads}</p>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(14, 165, 233, 0.1)', color: 'var(--info)' }}>
            <FiTrendingUp />
          </div>
          <div className="metric-info">
            <h3>Contacted</h3>
            <p>{contactedLeads}</p>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-icon emerald">
            <FiCheckCircle />
          </div>
          <div className="metric-info">
            <h3>Converted</h3>
            <p>{convertedLeads}</p>
          </div>
        </div>
      </div>

      {/* Control and Filter Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div className="filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              className="input-field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>

          <div className="filter-selectors">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiFilter style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }} />
              <select
                className="select-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ minWidth: '130px' }}
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
              </select>
            </div>

            <select
              className="select-field"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="all">All Sources</option>
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>

            <select
              className="select-field"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ minWidth: '130px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading database leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <FiFileText style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No leads found</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Connect your website webhook or adjust your search filter criteria.
            </p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={onShowDocs}>
              Integrate Website Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Client Details</th>
                  <th>Source Channel</th>
                  <th>Status</th>
                  <th>Received Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} onClick={() => setSelectedLead(lead)}>
                    <td>
                      <div className="lead-name-cell">{lead.name}</div>
                      <div className="lead-email-cell">{lead.email}</div>
                    </td>
                    <td>
                      <span className="lead-source-cell">{lead.source}</span>
                    </td>
                    <td>
                      {renderStatusBadge(lead.status)}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(lead.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over details drawer */}
      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          token={token}
          backendUrl={backendUrl}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
        />
      )}
    </div>
  );
};

export default Dashboard;
