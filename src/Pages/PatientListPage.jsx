import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaUserCircle } from 'react-icons/fa';

function PatientListPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("Admin_Token");
      const res = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.users) {
        setPatients(res.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const token = localStorage.getItem("Admin_Token");
      await axios.delete(`https://mediqueue-backend-1-4wve.onrender.com/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Patient deleted successfully");
      fetchPatients();
    } catch (error) {
      alert("Failed to delete patient");
    }
  };

  if (loading) return <div style={styles.loader}>Loading patients...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Patient Management</h2>
        <span style={styles.count}>{patients.length} Registered Patients</span>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Joined Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id} style={styles.row}>
                <td style={styles.td}>
                  <div style={styles.patientInfo}>
                    <div style={styles.patientAvatar}>
                      <FaUserCircle size={24} color="#3B82F6" />
                    </div>
                    <span style={styles.patientName}>{patient.username}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.emailText}>{patient.email}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.dateText}>{new Date(patient.createdAt).toLocaleDateString()}</span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleDelete(patient._id)} style={styles.deleteBtn} title="Delete Patient">
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && (
        <div style={styles.empty}>No patients found in the database.</div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#F8FAFC', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#0F172A', margin: 0 },
  count: { fontSize: '14px', color: '#64748B', fontWeight: '600', backgroundColor: '#F1F5F9', padding: '6px 12px', borderRadius: '10px' },
  tableWrapper: { backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '20px 24px', textAlign: 'left', backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '20px 24px', borderBottom: '1px solid #F8FAFC', color: '#334155', fontSize: '14px', verticalAlign: 'middle' },
  row: { transition: 'background-color 0.2s' },
  patientInfo: { display: 'flex', alignItems: 'center' },
  patientAvatar: { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' },
  patientName: { fontWeight: '700', color: '#0F172A', fontSize: '15px' },
  emailText: { color: '#64748B', fontWeight: '500' },
  dateText: { color: '#64748B', fontWeight: '600', fontSize: '13px' },
  deleteBtn: { width: '36px', height: '36px', borderRadius: '10px', border: 'none', backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loader: { padding: '100px', textAlign: 'center', fontSize: '18px', color: '#64748B', fontWeight: '600' },
  empty: { padding: '60px', textAlign: 'center', color: '#94A3B8', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #F1F5F9' }
};

export default PatientListPage;
