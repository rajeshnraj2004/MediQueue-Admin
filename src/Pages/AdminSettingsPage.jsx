import React, { useState } from 'react';
import { 
  FiSettings as Settings, 
  FiBell as Bell, 
  FiShield as Shield, 
  FiCreditCard as CreditCard, 
  FiDatabase as Database, 
  FiUser as User, 
  FiSave as Save, 
  FiAlertTriangle as AlertTriangle 
} from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState(50);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const containerStyle = {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif"
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 800,
    color: '#0F172A',
    margin: 0
  };

  const subTitleStyle = {
    color: '#64748B',
    fontSize: '15px',
    marginTop: '6px'
  };

  const saveBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2260FF',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(34, 96, 255, 0.2)',
    transition: 'all 0.2s ease'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '32px',
    border: '1px solid #E2E8F0',
    marginBottom: '24px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const inputGroupStyle = {
    marginBottom: '24px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '10px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#F8FAFC'
  };

  const dangerCardStyle = {
    ...cardStyle,
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Platform Settings</h1>
          <p style={subTitleStyle}>Configure global parameters and security thresholds.</p>
        </div>
        <button style={saveBtnStyle}>
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
        {/* Sidebar Mini */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SettingsNavItem icon={<Settings />} label="General" active />
          <SettingsNavItem icon={<Bell />} label="Notifications" />
          <SettingsNavItem icon={<Shield />} label="Security" />
          <SettingsNavItem icon={<CreditCard />} label="Payments" />
          <SettingsNavItem icon={<Database />} label="System" />
        </div>

        {/* Content */}
        <div>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              <Settings color="#2260FF" size={20} />
              General Configuration
            </h2>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Platform Name</label>
              <input style={inputStyle} defaultValue="MediQueue" />
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px', 
              backgroundColor: '#F8FAFC', 
              borderRadius: '16px',
              border: '1px solid #E2E8F0' 
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>Maintenance Mode</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>Disable access for all users during updates.</p>
              </div>
              <button 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                style={{
                  width: '56px',
                  height: '28px',
                  borderRadius: '20px',
                  backgroundColor: maintenanceMode ? '#2260FF' : '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: maintenanceMode ? '32px' : '4px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease'
                }} />
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>
              <CreditCard color="#10B981" size={20} />
              Payment Thresholds
            </h2>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Default Consultation Fee (₹)</label>
              <input 
                type="number" 
                style={inputStyle} 
                value={platformFee} 
                onChange={(e) => setPlatformFee(e.target.value)} 
              />
            </div>
          </div>

          <div style={dangerCardStyle}>
            <h2 style={{ ...sectionTitleStyle, color: '#991B1B' }}>
              <AlertTriangle color="#DC2626" size={20} />
              Danger Zone
            </h2>
            <p style={{ color: '#991B1B', fontSize: '14px', marginBottom: '20px', fontWeight: 500 }}>
              Actions here are irreversible. Please double-check before proceeding.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ 
                padding: '10px 20px', 
                borderRadius: '10px', 
                border: '1px solid #FECACA', 
                backgroundColor: 'white', 
                color: '#DC2626', 
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Clear All Logs
              </button>
              <button style={{ 
                padding: '10px 20px', 
                borderRadius: '10px', 
                border: 'none', 
                backgroundColor: '#DC2626', 
                color: 'white', 
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Factory Reset Platform
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon, label, active = false }) {
  return (
    <button style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      borderRadius: '14px',
      border: 'none',
      backgroundColor: active ? '#EFF6FF' : 'transparent',
      color: active ? '#2260FF' : '#64748B',
      fontWeight: active ? 700 : 600,
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s ease'
    }}>
      <span style={{ fontSize: '18px', display: 'flex' }}>{icon}</span>
      {label}
    </button>
  );
}
