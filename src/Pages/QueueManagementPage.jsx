import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LuCalendarCheck } from "react-icons/lu";
import { FaUserDoctor } from "react-icons/fa6";

function QueueManagementPage() {
  const [openClinics, setOpenClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOpenClinics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('Admin_Token');
      // Re-using doctor API but filtering for open clinics
      const res = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOpenClinics(res.data.data.filter(d => d.isClinicOpen));
      }
    } catch (err) {
      console.error('Failed to fetch open clinics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOpenClinics(); }, []);

  if (loading) return <div style={styles.loader}>Tracking live queues...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Live Queue Monitoring</h2>
          <p style={styles.subtitle}>{openClinics.length} clinics are currently open and serving patients</p>
        </div>
      </div>

      <div style={styles.grid}>
        {openClinics.map(clinic => (
          <div key={clinic._id} style={styles.card}>
            <div style={styles.cardTop}>
              <div style={styles.doctorInfo}>
                <div style={styles.avatar}>
                  {clinic.profileImage ? <img src={clinic.profileImage} style={styles.avatarImg} alt=""/> : <FaUserDoctor/>}
                </div>
                <div>
                  <h3 style={styles.doctorName}>Dr. {clinic.name}</h3>
                  <p style={styles.specialization}>{clinic.specialization}</p>
                </div>
              </div>
              <div style={styles.liveBadge}>LIVE</div>
            </div>
            
            <div style={styles.statsRow}>
               <div style={styles.statItem}>
                  <span style={styles.statLabel}>Next Number</span>
                  <span style={styles.statValue}>{clinic.currentQueueNumber + 1}</span>
               </div>
               <div style={styles.statItem}>
                  <span style={styles.statLabel}>Clinic Name</span>
                  <span style={styles.statValueCompact}>{clinic.clinicName}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {openClinics.length === 0 && (
        <div style={styles.empty}>
           <LuCalendarCheck size={48} color="#E2E8F0" />
           <p style={{marginTop: 16, color: '#94A3B8', fontWeight: 600}}>No live queues at the moment.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '32px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0 },
  subtitle: { fontSize: '15px', color: '#64748B', marginTop: '6px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  doctorInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  doctorName: { fontSize: '17px', fontWeight: '700', color: '#0F172A', margin: 0 },
  specialization: { fontSize: '13px', color: '#64748B', marginTop: '2px' },
  liveBadge: { backgroundColor: '#FEF2F2', color: '#EF4444', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' },
  statsRow: { display: 'flex', gap: '16px', borderTop: '1px solid #F8FAFC', paddingTop: '16px' },
  statItem: { flex: 1 },
  statLabel: { fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '700' },
  statValue: { fontSize: '24px', fontWeight: '800', color: '#0F172A', display: 'block', marginTop: '4px' },
  statValueCompact: { fontSize: '14px', fontWeight: '700', color: '#475569', display: 'block', marginTop: '4px' },
  loader: { padding: '80px', textAlign: 'center', color: '#64748B', fontWeight: 600 },
  empty: { padding: '60px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center' }
};

export default QueueManagementPage;
