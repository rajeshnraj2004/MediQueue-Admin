import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { LuCalendarCheck } from "react-icons/lu";
import { GrUserAdmin } from "react-icons/gr";
import AdminDashboard from "./AdminDashboard.jsx";
import PatientListPage from "./PatientListPage.jsx";
import DoctorListPage from "./DoctorListPage.jsx";
import AppointmentsListPage from "./AppointmentsListPage.jsx";
import QueueManagementPage from "./QueueManagementPage.jsx";
import AdminAnalyticsPage from "./AdminAnalyticsPage.jsx";

const navItems = [
  { icon: <RxDashboard />, label: "Dashboard", component: <AdminDashboard /> },
  { icon: <FaUsers />, label: "Patients", component: <PatientListPage /> },
  { icon: <SlCalender />, label: "Appointments", component: <AppointmentsListPage /> },
  { icon: <FaUserDoctor />, label: "Doctors", component: <DoctorListPage /> },
  { icon: <LuCalendarCheck />, label: "Queue", component: <QueueManagementPage /> },
  { icon: <RxDashboard />, label: "Analytics", component: <AdminAnalyticsPage /> },
];


function AdminHomePage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("Admin_Token");
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      backgroundColor: "#F8FAFC",
    }}>

      {/* Top Navbar */}
      <div style={{
        backgroundColor: "#FFFFFF",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #E2E8F0",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#2260FF', padding: '8px', borderRadius: '10px' }}>
            <GrUserAdmin color="white" size={18} />
          </div>
          <h2 style={{ color: "#0F172A", margin: 0, fontSize: "18px", fontWeight: 800, letterSpacing: '-0.5px' }}>
            MediQueue Admin
          </h2>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#FEF2F2",
            color: "#EF4444",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#FEE2E2";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#FEF2F2";
          }}
        >
          Logout
        </button>
      </div>

      {/* Body: Sidebar + Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: "260px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          padding: "32px 16px",
          gap: "8px",
          flexShrink: 0,
        }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: isActive ? "#EFF6FF" : "transparent",
                  color: isActive ? "#2260FF" : "#64748B",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#F8FAFC";
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ 
                  fontSize: "20px", 
                  display: 'flex', 
                  color: isActive ? "#2260FF" : "#94A3B8" 
                }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "#F8FAFC",
        }}>
          {navItems.find(item => item.label === activeNav)?.component || (
            <div style={{ padding: '40px' }}>
              <h3 style={{ color: "#0F172A", marginBottom: "8px", fontSize: "24px", fontWeight: 800 }}>
                {activeNav}
              </h3>
              <p style={{ color: "#64748B", fontSize: "15px", fontWeight: 500 }}>
                Manage your healthcare network's <strong>{activeNav.toLowerCase()}</strong> data here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}


export default AdminHomePage
