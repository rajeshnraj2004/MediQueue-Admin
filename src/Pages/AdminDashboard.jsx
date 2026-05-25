import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";

function AdminDashboard() {
    const [stats, setStats] = useState({ doctors: 0, users: 0, appointments: 0, queues: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("Admin_Token");
            try {
                const res = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.welcomeSection}>
                <h3 style={styles.welcomeTitle}>Admin Overview</h3>
                <p style={styles.welcomeSub}>Manage your healthcare platform metrics in real-time.</p>
            </div>
            
            <div style={styles.statsGrid}>
                <StatCard icon={<FaUserDoctor color="#2563EB" size={24}/>} title="Total Doctors" value={stats.doctors} />
                <StatCard icon={<FaUsers color="#7C3AED" size={24}/>} title="Total Patients" value={stats.users} />
                <StatCard icon={<SlCalender color="#EC4899" size={24}/>} title="Appointments" value={stats.appointments} />
                <StatCard icon={<RxDashboard color="#F59E0B" size={24}/>} title="Active Queues" value={stats.queues} />
            </div>
        </div>
    );
}

const StatCard = ({ icon, title, value }) => (
    <div style={styles.statsCard}>
        <div style={styles.cardHeader}>
            <div style={styles.iconWrapper}>{icon}</div>
            <span style={styles.cardValue}>{value}</span>
        </div>
        <h4 style={styles.cardTitle}>{title}</h4>
    </div>
);

const styles = {
    container: { padding: '40px' },
    welcomeSection: { marginBottom: '40px' },
    welcomeTitle: { fontSize: '32px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-1px' },
    welcomeSub: { fontSize: '16px', color: '#64748B', marginTop: '10px', fontWeight: 500 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' },
    statsCard: {
        backgroundColor: '#fff',
        padding: '28px',
        borderRadius: '24px',
        border: '1px solid #F1F5F9',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    iconWrapper: { width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardValue: { fontSize: '36px', fontWeight: '800', color: '#0F172A', letterSpacing: '-1px' },
    cardTitle: { fontSize: '15px', fontWeight: '700', color: '#94A3B8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' },
};

export default AdminDashboard;
