"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { useForm, FormProvider } from 'react-hook-form';
import { 
  Trophy, Target, Activity, Zap, User, 
  Camera, Mail, Users, X 
} from 'lucide-react';

import AppButton from '@/shared/components/atoms/AppButton';
import AppCard from '@/shared/components/molecules/AppCard';
import FormField from '@/shared/components/atoms/FormField';

export default function ProfileDashboard() {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [userData, setUserData] = useState({
    fullName: 'James Rodriguez',
    handle: '@el_10',
    email: 'james@skorify.com'
  });

  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm({
    values: userData 
  });

  useEffect(() => { 
    setMounted(true); 
  }, []);

  const theme = {
    bgDark: '#0a0a0f', 
    accentPurple: '#8b5cf6',
    accentOrange: '#f97316',
    successGreen: '#4ade80',
    infoBlue: '#38bdf8',
    textSecondary: '#94a3b8' 
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onSubmit = (data: any) => {
    setUserData(data); 
    handleCloseModal();
  };

  const handleCameraClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);
    }
  };

  if (!mounted) return null;

  return (
    <div className="dashboard-wrapper">
      <div className="main-grid">
        
        {/* Sidebar Profile */}
        <aside className="sidebar">
          <AppCard>
            <div className="profile-content">
              <div className="avatar-section">
                <div className="avatar-glow"></div>
                <div className="avatar-circle">
                  {avatarImage ? (
                    <img src={avatarImage} alt="Avatar" className="avatar-img" />
                  ) : (
                    <User size={40} color={theme.accentPurple} />
                  )}
                </div>
                <button className="camera-badge" onClick={handleCameraClick}>
                  <Camera size={14} />
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
              
              <h2 className="user-name">{userData.fullName}</h2>
              <p className="user-handle">{userData.handle}</p>
              <div className="user-email"><Mail size={12} /> {userData.email}</div>
              
              <div className="btn-wrapper">
                <AppButton onClick={handleOpenModal}>
                  Editar Perfil
                </AppButton>
              </div>
            </div>
          </AppCard>

          <AppCard>
            <div className="groups-content">
              <h4 className="section-label">GRUPOS ACTIVOS</h4>
              <div className="group-item" onClick={() => router.push('/groups')}>
                <div className="group-info">
                  <Users size={16} color="white" />
                  <span className="group-name">Liga Colombiana 2026</span>
                </div>
                <span className="rank-badge">#3</span>
              </div>
            </div>
          </AppCard>
        </aside>

        {/* Main Stats */}
        <main className="stats-content">
          <div className="stats-header">
            <h1 className="main-title">Estadísticas</h1>
            <div className="points-section">
              <span className="points-label">PUNTAJE TOTAL</span>
              <div className="points-row">
                <span className="points-value">2,450</span>
                <Trophy size={32} className="trophy-icon" color={theme.accentPurple} />
              </div>
            </div>
          </div>

          <div className="performance-grid">
            <AppCard>
              <div className="stat-box">
                <Target color={theme.successGreen} size={24} />
                <span className="stat-desc">EXACTOS</span>
                <span className="stat-num" style={{ color: theme.successGreen }}>25 / 100</span>
              </div>
            </AppCard>
            <AppCard>
              <div className="stat-box">
                <Activity color={theme.infoBlue} size={24} />
                <span className="stat-desc">PARCIALES</span>
                <span className="stat-num" style={{ color: theme.infoBlue }}>40 / 100</span>
              </div>
            </AppCard>
            <AppCard>
              <div className="stat-box">
                <div className="soccer-ball-meter">
                  <span className="percent-text">45%</span>
                </div>
                <span className="stat-desc">ACIERTOS</span>
              </div>
            </AppCard>
            <AppCard>
              <div className="stat-box">
                <span className="stat-num-large" style={{ color: theme.infoBlue }}>120</span>
                <span className="stat-desc">TOTAL</span>
              </div>
            </AppCard>
          </div>

          <div className="bottom-cards">
            <AppCard>
              <div className="participation-content">
                <div className="flex-between">
                  <span className="participation-label">PARTICIPACIÓN SKORIFY</span>
                  <span className="percent-tag">85%</span>
                </div>
                <div className="track-bar" role="progressbar" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}>
                  <div className="fill-bar"><div className="pearl-glow"></div></div>
                </div>
              </div>
            </AppCard>

            <AppCard>
              <div className="streak-content">
                <div className="streak-header">
                  <Zap color={theme.accentOrange} fill={theme.accentOrange} size={22} />
                  <div>
                    <h4 className="streak-title">¡IMPARABLE!</h4>
                    <p className="streak-sub">12 aciertos seguidos</p>
                  </div>
                </div>
                <div className="streak-dots">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`dot ${i < 7 ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
            </AppCard>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <AppCard>
              <div className="modal-inner">
                <div className="modal-header">
                  <h3>Editar Datos Personales</h3>
                  <X className="close-icon" onClick={handleCloseModal} />
                </div>
                
    <FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)} className="form-spacing">
    <FormField name="fullName" label="NOMBRE COMPLETO" control={methods.control} />
    <FormField name="handle" label="APODO (HANDLE)" control={methods.control} />
    <FormField name="email" label="CORREO ELECTRÓNICO" control={methods.control} />
    
    <div className="modal-actions" style={{ marginTop: '20px' }}>
      <AppButton type="submit">Guardar Cambios</AppButton>
    </div>
  </form>
</FormProvider>
              </div>
            </AppCard>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-wrapper { background: ${theme.bgDark}; min-height: 100vh; color: white; padding: 40px 20px; font-family: sans-serif; display: flex; justify-content: center; }
        .main-grid { width: 100%; max-width: 1100px; display: grid; grid-template-columns: 280px 1fr; gap: 25px; }
        .sidebar { display: flex; flex-direction: column; gap: 15px; } 
        .profile-content { padding: 20px 15px; text-align: center; }
        .avatar-section { position: relative; width: 85px; height: 85px; margin: 0 auto 10px; } 
        .avatar-glow { position: absolute; inset: -4px; background: linear-gradient(135deg, ${theme.accentPurple}, ${theme.accentOrange}); border-radius: 50%; opacity: 0.4; filter: blur(10px); }
        .avatar-circle { position: relative; width: 100%; height: 100%; border-radius: 50%; background: #16161f; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,0.1); overflow: hidden; }
        .avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .camera-badge { position: absolute; bottom: 0; right: 0; background: ${theme.accentOrange}; border: 3px solid #16161f; border-radius: 50%; padding: 5px; color: white; cursor: pointer; }
        .user-name { font-size: 20px; font-weight: 800; margin: 0; } 
        .user-handle { color: ${theme.accentPurple}; font-weight: 700; font-size: 14px; margin: 3px 0 8px; }
        .user-email { color: ${theme.textSecondary}; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 20px; }
        .btn-wrapper { display: flex; justify-content: center; }
        .groups-content { padding: 15px; }
        .section-label { font-size: 11px; font-weight: 800; color: ${theme.textSecondary}; letter-spacing: 1px; margin-bottom: 12px; display: block; }
        .group-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 10px; cursor: pointer; }
        .group-name { font-size: 13px; font-weight: 600; }
        .rank-badge { color: ${theme.accentOrange}; font-weight: 900; }
        .stats-content { display: flex; flex-direction: column; gap: 24px; }
        .stats-header { display: flex; justify-content: space-between; align-items: center; }
        .main-title { font-size: 28px; font-weight: 900; margin: 0; } 
        .points-section { display: flex; flex-direction: column; align-items: flex-end; } 
        .points-label { font-size: 11px; font-weight: 800; color: ${theme.textSecondary}; }
        .points-row { display: flex; align-items: center; gap: 12px; }
        .points-value { font-size: 42px; font-weight: 900; } 
        .performance-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; } 
        .stat-box { padding: 15px 10px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .stat-desc { font-size: 11px; font-weight: 800; color: ${theme.textSecondary}; }
        .stat-num { font-size: 18px; font-weight: 900; } 
        .stat-num-large { font-size: 28px; font-weight: 900; } 
        .soccer-ball-meter { position: relative; width: 50px; height: 50px; border-radius: 50%; background: conic-gradient(${theme.accentOrange} 45%, #1a1a24 45%); display: flex; align-items: center; justify-content: center; }
        .soccer-ball-meter::before { content: ""; position: absolute; inset: 4px; background: #111116; border-radius: 50%; }
        .percent-text { font-size: 13px; font-weight: 900; z-index: 5; }
        .bottom-cards { display: flex; flex-direction: column; gap: 15px; } 
        .participation-content { padding: 18px; } 
        .flex-between { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .participation-label { font-size: 12px; font-weight: 800; }
        .percent-tag { color: ${theme.accentOrange}; font-weight: 900; }
        .track-bar { height: 8px; background: #1a1a24; border-radius: 10px; width: 100%; }
        .fill-bar { height: 100%; width: 85%; background: linear-gradient(90deg, ${theme.accentPurple}, ${theme.accentOrange}); border-radius: 10px; position: relative; }
        .pearl-glow { position: absolute; right: -7px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; background: white; border-radius: 50%; box-shadow: 0 0 8px white, 0 0 12px ${theme.accentOrange}; }
        .streak-content { padding: 18px; } 
        .streak-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .streak-title { margin: 0; font-size: 16px; font-weight: 800;}
        .streak-dots { display: flex; gap: 8px; }
        .dot { flex: 1; height: 6px; background: #1a1a24; border-radius: 4px; }
        .dot.active { background: ${theme.accentOrange}; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-container { width: 90%; max-width: 450px; }
        .modal-inner { padding: 25px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close-icon { cursor: pointer; opacity: 0.7; }
        .form-spacing { display: flex; flex-direction: column; gap: 15px; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}