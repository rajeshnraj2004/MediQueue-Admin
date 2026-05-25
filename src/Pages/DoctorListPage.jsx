import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay, FaCheck, FaTimes, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("Admin_Token");
      const res = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this doctor?`)) return;
    try {
      const token = localStorage.getItem("Admin_Token");
      const res = await axios.put(`https://mediqueue-backend-1-4wve.onrender.com/api/doctors/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(`Doctor ${action}ed successfully`);
        fetchDoctors();
      }
    } catch (error) {
      alert(`Failed to ${action} doctor`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this doctor? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("Admin_Token");
      const res = await axios.delete(`https://mediqueue-backend-1-4wve.onrender.com/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert("Doctor deleted successfully");
        fetchDoctors();
      }
    } catch (error) {
      alert("Failed to delete doctor");
    }
  };

  const filteredDoctors = doctors.filter(doc => filter === 'all' ? true : doc.status === filter);

  if (loading) return <div style={styles.loader}>Loading Staff Records...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Medical Staff Management</h2>
          <p style={styles.subtitle}>Verify credentials and manage doctor profiles</p>
        </div>
        <div style={styles.filterGroup}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              style={{...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {})}}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {filteredDoctors.map(doctor => (
          <div key={doctor._id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.avatarWrapper}>
                <img 
                  src={doctor.profileImage || 'https://via.placeholder.com/80'} 
                  alt={doctor.name} 
                  style={styles.avatar} 
                />
                <div style={{
                  ...styles.statusDot,
                  backgroundColor: doctor.status === 'approved' ? '#10B981' : doctor.status === 'pending' ? '#F59E0B' : '#EF4444'
                }} />
              </div>
              <div style={styles.cardActionsHeader}>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: doctor.status === 'approved' ? '#ECFDF5' : doctor.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                  color: doctor.status === 'approved' ? '#065F46' : doctor.status === 'pending' ? '#92400E' : '#991B1B'
                }}>
                  {doctor.status.toUpperCase()}
                </span>
                <button onClick={() => handleDelete(doctor._id)} style={styles.deleteIconBtn} title="Delete Doctor">
                  <FaTrash size={14} />
                </button>
              </div>
            </div>

            <div style={styles.cardBody}>
              <h3 style={styles.doctorName}>Dr. {doctor.name}</h3>
              <p style={styles.specialization}>{doctor.specialization}</p>
              
              <div style={styles.infoList}>
                <InfoRow icon={<FaPlay size={10} color="#94A3B8"/>} label="Experience" value={`${doctor.experience} Years`} />
                <InfoRow icon={<FaPlay size={10} color="#94A3B8"/>} label="License ID" value={doctor.licenseNumber} />
                <InfoRow icon={<FaPlay size={10} color="#94A3B8"/>} label="Clinic" value={doctor.clinicName} />
              </div>
            </div>

            <div style={styles.cardFooter}>
              <button 
                onClick={() => window.open(doctor.licenseDocument, '_blank')} 
                style={styles.viewDocBtn}
              >
                <FaExternalLinkAlt style={{marginRight: 8}} /> Credentials
              </button>
              
              <div style={styles.actionGroup}>
                {doctor.status !== 'approved' && (
                  <button onClick={() => handleAction(doctor._id, 'approve')} style={styles.approveBtn}>
                    Approve
                  </button>
                )}
                {doctor.status !== 'rejected' && (
                  <button onClick={() => handleAction(doctor._id, 'reject')} style={styles.rejectBtn}>
                    Reject
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && (
        <div style={styles.empty}>
          <p>No medical staff records found for this category.</p>
        </div>
      )}
    </div>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <div style={styles.infoRow}>
    <div style={styles.infoRowLeft}>
      {icon}
      <span style={styles.infoLabel}>{label}</span>
    </div>
    <span style={styles.infoValue}>{value}</span>
  </div>
);

const styles = {
  container: { padding: '30px', backgroundColor: '#F8FAFC', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0 },
  subtitle: { fontSize: '15px', color: '#64748B', marginTop: '4px' },
  filterGroup: { display: 'flex', gap: '8px', backgroundColor: '#F1F5F9', padding: '6px', borderRadius: '14px' },
  filterBtn: { padding: '8px 20px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#64748B', transition: 'all 0.2s' },
  filterBtnActive: { backgroundColor: '#fff', color: '#0F172A', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #F1F5F9', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03)', transition: 'transform 0.2s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: '80px', height: '80px', borderRadius: '24px', objectFit: 'cover', backgroundColor: '#F8FAFC' },
  statusDot: { position: 'absolute', bottom: '-4px', right: '-4px', width: '16px', height: '16px', borderRadius: '8px', border: '3px solid #fff' },
  cardActionsHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  statusBadge: { padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.5px' },
  deleteIconBtn: { width: '32px', height: '32px', borderRadius: '10px', border: 'none', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  cardBody: { flex: 1, marginBottom: '24px' },
  doctorName: { fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' },
  specialization: { fontSize: '14px', color: '#2563EB', fontWeight: '700', marginBottom: '20px', backgroundColor: '#EFF6FF', display: 'inline-block', padding: '4px 10px', borderRadius: '6px' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoRowLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  infoLabel: { fontSize: '13px', color: '#64748B', fontWeight: '500' },
  infoValue: { fontSize: '13px', color: '#0F172A', fontWeight: '700' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #F8FAFC' },
  viewDocBtn: { display: 'flex', alignItems: 'center', color: '#64748B', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s' },
  actionGroup: { display: 'flex', gap: '10px' },
  approveBtn: { flex: 1, padding: '10px 16px', borderRadius: '12px', backgroundColor: '#0F172A', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s' },
  rejectBtn: { flex: 1, padding: '10px 16px', borderRadius: '12px', backgroundColor: '#fff', color: '#EF4444', border: '1px solid #FEE2E2', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'all 0.2s' },

  loader: { padding: '100px', textAlign: 'center', fontSize: '18px', color: '#64748B', fontWeight: '600' },
  empty: { padding: '60px', textAlign: 'center', color: '#94A3B8', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #F1F5F9' }
};


export default DoctorListPage;
