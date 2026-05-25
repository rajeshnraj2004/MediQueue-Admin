import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiRefreshCw } from 'react-icons/fi';
import { SlCalender } from 'react-icons/sl';
import { FaCircle } from 'react-icons/fa';

const STATUS_COLORS = {
  Upcoming:  { bg: '#EEF2FF', color: '#4F46E5' },
  Completed: { bg: '#D1FAE5', color: '#059669' },
  Cancelled: { bg: '#FEE2E2', color: '#DC2626' },
};

const PAYMENT_COLORS = {
  Completed: { bg: '#D1FAE5', color: '#059669' },
  Pending:   { bg: '#FEF3C7', color: '#D97706' },
};

function AppointmentsListPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('Admin_Token');
      const res = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setAppointments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filtered = appointments.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  if (loading) return (
    <div style={styles.loader}>
      <SlCalender size={48} color="#E2E8F0" />
      <p style={{ color: '#94A3B8', marginTop: 16, fontWeight: 600 }}>Loading appointments...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>All Appointments</h2>
          <p style={styles.subtitle}>{appointments.length} total appointments across all doctors</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Filter Pills */}
          <div style={styles.filterGroup}>
            {['all', 'Upcoming', 'Completed', 'Cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          {/* Refresh */}
          <button onClick={fetchAppointments} style={styles.refreshBtn} title="Refresh">
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <SlCalender size={56} color="#E2E8F0" />
          <p style={{ color: '#94A3B8', marginTop: 16, fontSize: 16, fontWeight: 600 }}>No appointments found.</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Specialization</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Fee</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, idx) => {
                const statusStyle = STATUS_COLORS[appt.status] || STATUS_COLORS.Upcoming;
                const payStyle = PAYMENT_COLORS[appt.paymentStatus] || PAYMENT_COLORS.Pending;
                return (
                  <tr
                    key={appt._id}
                    style={{ ...styles.tr, backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F7FF')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC')}
                  >
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <div style={styles.avatar}>
                          {(appt.patientId?.username || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={styles.namePrimary}>{appt.patientId?.username || '—'}</div>
                          <div style={styles.nameSecondary}>{appt.patientId?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.namePrimary}>Dr. {appt.doctorId?.name || '—'}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.specBadge}>{appt.doctorId?.specialization || '—'}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateText}>
                        {appt.date ? new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td style={styles.td}><span style={styles.dateText}>{appt.time || '—'}</span></td>
                    <td style={styles.td}>
                      <span style={{ ...styles.dateText, color: '#059669', fontWeight: 700 }}>₹{appt.fee || 0}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                        <FaCircle size={6} />
                        {appt.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: payStyle.bg, color: payStyle.color }}>
                        {appt.paymentStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '32px', fontFamily: "'Inter', system-ui, sans-serif" },
  loader: { padding: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '32px', gap: '16px', flexWrap: 'wrap',
  },
  title: { fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: '6px', fontWeight: 500 },
  filterGroup: {
    display: 'flex', gap: '6px', backgroundColor: '#F1F5F9',
    padding: '5px', borderRadius: '12px',
  },
  filterBtn: {
    padding: '7px 16px', borderRadius: '9px', border: 'none',
    backgroundColor: 'transparent', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', color: '#64748B', transition: 'all 0.2s',
  },
  filterBtnActive: { backgroundColor: '#fff', color: '#0F172A', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' },
  refreshBtn: {
    width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #E2E8F0',
    backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#64748B', transition: 'all 0.2s',
  },
  empty: {
    padding: '60px', textAlign: 'center', backgroundColor: '#fff',
    borderRadius: '20px', border: '1px solid #F1F5F9',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  tableWrapper: {
    backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #F1F5F9',
    overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  theadRow: { backgroundColor: '#F8FAFC', borderBottom: '2px solid #F1F5F9' },
  th: {
    padding: '14px 16px', textAlign: 'left', fontSize: '11px',
    fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px',
  },
  tr: { transition: 'background-color 0.15s', cursor: 'default' },
  td: { padding: '14px 16px', borderBottom: '1px solid #F8FAFC', verticalAlign: 'middle' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#6366F1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '15px', fontWeight: '800', flexShrink: 0,
  },
  namePrimary: { fontSize: '14px', fontWeight: '700', color: '#0F172A' },
  nameSecondary: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  specBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '6px',
    backgroundColor: '#EFF6FF', color: '#2563EB', fontSize: '12px', fontWeight: '700',
  },
  dateText: { fontSize: '13px', color: '#475569', fontWeight: '500' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '4px 10px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700',
  },
};

export default AppointmentsListPage;
