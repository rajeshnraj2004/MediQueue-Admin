import React, { useState, useEffect } from 'react'
import adminImg from '../assets/Images/admin.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, skip the login page
  useEffect(() => {
    if (localStorage.getItem("Admin_Token")) {
      navigate("/AdminHomePage");
    }
  }, [navigate]);

  const adminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await axios.post("https://mediqueue-backend-1-4wve.onrender.com/api/admin/login", {
        email: adminEmail,
        password: adminPassword,
      });

      localStorage.setItem("Admin_Token", response.data.token);
      navigate("/AdminHomePage");
    } catch (error) {
      console.log("Error while logging in", error);
      const msg = error.response?.data?.message || "Invalid credentials. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{
      backgroundColor: "#F8FAFC",
      minHeight: "100vh",
      width: "100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    }}>

      { /* Login Container */ }
      <div className="login-container"
      style={{
        width:"900px",
        height:"540px",
        backgroundColor:"#ffffff",
        borderRadius:"24px",
        display:"flex",
        overflow: "hidden",
        boxShadow:"0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
        border: '1px solid #F1F5F9'
      }}  
      > 
        <div className="hero" style={{ 
          flex: 1, 
          backgroundColor: '#EFF6FF', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <img src={adminImg} alt="Admin" 
            style={{
              width: 380,
              height: 'auto',
              marginBottom: '20px'
            }}
          />
          <h1 style={{ color: '#1E3A8A', fontSize: '28px', fontWeight: 800 }}>MediQueue</h1>
          <p style={{ color: '#3B82F6', fontWeight: 600 }}>Healthcare Administration Portal</p>
        </div>

        <div className="login-right" style={{
          flex: 1,
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column",
          padding: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{
              margin: '0 0 8px 0',
              color:"#0F172A",
              fontSize: '24px',
              fontWeight: 800
            }}>Admin Login</h3>
            <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Secure access to dashboard</p>
          </div>

          <form onSubmit={adminLogin} style={{ width: '100%', maxWidth: '300px' }}>
            <div className="input-group" style={{ marginBottom:"16px" }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Email Address</label>
              <input type="email" placeholder="admin@mediqueue.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{
                  width:"100%",
                  height:"48px",
                  borderRadius:"12px",
                  padding:"0 16px",
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  backgroundColor: '#F8FAFC'
                }}/>
            </div>

            <div className="input-group" style={{ marginBottom:"24px" }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Password</label>
              <input type="password" placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width:"100%",
                  height:"48px",
                  borderRadius:"12px",
                  padding:"0 16px",
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  backgroundColor: '#F8FAFC'
                }}/>
            </div>

            <button type="submit" disabled={loading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width:"100%",
                height:"48px",
                borderRadius:"12px",
                backgroundColor: isHovered ? "#1E40AF" : "#2260FF",
                color: "#ffffff",
                border:"none",
                fontWeight: 700,
                cursor: "pointer",
                transition:"all 0.2s ease",
                boxShadow: "0 4px 6px -1px rgba(34, 96, 255, 0.2)",
              }}>
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>

            {errorMsg && (
              <p style={{
                color: "#EF4444",
                fontSize: "12px",
                marginTop: "16px",
                textAlign: "center",
                fontWeight: 600,
                padding: '10px',
                backgroundColor: '#FEF2F2',
                borderRadius: '8px'
              }}>{errorMsg}</p>
            )}
          </form>
          
        </div> 

      </div>

    </div>
  )
}


export default AdminLoginPage
