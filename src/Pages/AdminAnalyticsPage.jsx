import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiActivity, 
  FiPieChart, 
  FiArrowUpRight, 
  FiArrowDownRight,
  FiCalendar,
  FiRefreshCw
} from 'react-icons/fi';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ doctors: 0, users: 0, appointments: 0, queues: 0 });
  const [revenue, setRevenue] = useState(0);
  const [growthData, setGrowthData] = useState(new Array(12).fill(0));
  const [topDoctors, setTopDoctors] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("Admin_Token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Fetch Basic Stats
      const statsRes = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/admin/stats', { headers });
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch Detailed Appointments for processing
      const apptRes = await axios.get('https://mediqueue-backend-1-4wve.onrender.com/api/admin/appointments', { headers });
      if (apptRes.data.success) {
        const appts = apptRes.data.data;
        
        // Process Revenue (Completed appointments)
        const totalRev = appts
          .filter(a => a.paymentStatus === 'Completed')
          .reduce((sum, a) => sum + (a.fee || 0), 0);
        setRevenue(totalRev);

        // Process Growth (Apt counts per month)
        const months = new Array(12).fill(0);
        appts.forEach(a => {
          const date = new Date(a.date);
          if (!isNaN(date)) {
            months[date.getMonth()]++;
          }
        });
        setGrowthData(months);

        // Process Top Doctors
        const docMap = {};
        appts.forEach(a => {
          const name = a.doctorId?.name || 'Unknown';
          docMap[name] = (docMap[name] || 0) + 1;
        });
        const sortedDocs = Object.entries(docMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopDoctors(sortedDocs);
      }
    } catch (error) {
      console.error("Analytics fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerStyle = {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F8FAFC',
    minHeight: '100%'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  if (loading) {
    return (
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <FiRefreshCw className="spin" size={40} color="#2260FF" />
                <p style={{ marginTop: '16px', color: '#64748B', fontWeight: 600 }}>Analyzing platform records...</p>
                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spin { animation: spin 1s linear infinite; }
                `}</style>
            </div>
        </div>
    );
  }

  const maxGrowth = Math.max(...growthData, 1);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Platform Analytics</h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px' }}>Real-time overview based on actual appointment data.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={fetchData} style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
            borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: 'white', 
            fontWeight: 600, color: '#475569', cursor: 'pointer' 
          }}>
            <FiRefreshCw /> Sync Data
          </button>
        </div>
      </div>

      <div style={statsGridStyle}>
        <AnalyticsStat 
          title="Total Appointments" 
          value={stats.appointments} 
          change="+100%" 
          up={true} 
          icon={<FiActivity color="#2260FF" />} 
          bg="#EFF6FF"
        />
        <AnalyticsStat 
          title="Active Patients" 
          value={stats.users} 
          change="Real-time" 
          up={true} 
          icon={<FiUsers color="#7C3AED" />} 
          bg="#F5F3FF"
        />
        <AnalyticsStat 
          title="Total Revenue" 
          value={`₹${revenue}`} 
          change="Live" 
          up={true} 
          icon={<FiTrendingUp color="#10B981" />} 
          bg="#ECFDF5"
        />
        <AnalyticsStat 
          title="Total Doctors" 
          value={stats.doctors} 
          change="Verified" 
          up={true} 
          icon={<FiPieChart color="#F59E0B" />} 
          bg="#FFFBEB"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        {/* Growth Chart Simulation */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>Monthly Patient Traffic</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2260FF' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2260FF' }} /> Appointments
              </div>
            </div>
          </div>
          
          <div style={{ height: '240px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            {growthData.map((h, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: '#EFF6FF', borderRadius: '4px', position: 'relative', height: '100%' }}>
                <div style={{ 
                  position: 'absolute', bottom: 0, width: '100%', 
                  height: `${(h / maxGrowth) * 100}%`, backgroundColor: '#2260FF', borderRadius: '4px',
                  transition: 'height 0.8s ease-out'
                }} />
                {h > 0 && <span style={{ position: 'absolute', top: '-24px', width: '100%', textAlign: 'center', fontSize: '10px', color: '#2260FF', fontWeight: 700 }}>{h}</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: '#94A3B8', fontSize: '11px', fontWeight: 700 }}>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Top Doctors / Recent Activity */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>Top Performing Staff</h3>
          {topDoctors.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {topDoctors.map((doc, i) => (
                    <PerformanceRow 
                        key={i}
                        name={doc.name} 
                        count={`${doc.count} Appointments`} 
                        color={['#2260FF', '#7C3AED', '#10B981', '#F59E0B', '#EC4899'][i % 5]} 
                        percent={(doc.count / (stats.appointments || 1)) * 100}
                    />
                ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <FiPieChart size={40} style={{ marginBottom: '12px' }} />
                <p>No appointment data found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyticsStat({ title, value, change, up, icon, bg }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ padding: '12px', borderRadius: '16px', backgroundColor: bg, display: 'flex' }}>
          {icon}
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '8px',
          backgroundColor: up ? '#ECFDF5' : '#FEF2F2', 
          color: up ? '#059669' : '#DC2626',
          fontSize: '11px', fontWeight: 800, textTransform: 'uppercase'
        }}>
          {change}
        </div>
      </div>
      <h4 style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: 600 }}>{title}</h4>
      <p style={{ margin: '4px 0 0 0', color: '#0F172A', fontSize: '26px', fontWeight: 800 }}>{value}</p>
    </div>
  );
}

function PerformanceRow({ name, count, color, percent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: color, fontSize: '16px', border: '1px solid #E2E8F0' }}>
        {name.split(' ')[1]?.[0] || name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>Dr. {name}</h5>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>{count}</p>
      </div>
      <div style={{ width: '70px', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(percent, 100)}%`, height: '100%', backgroundColor: color }} />
      </div>
    </div>
  );
}
