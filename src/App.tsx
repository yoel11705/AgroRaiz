import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import CropsManager from './components/Crops/CropsManager';
import HarvestsManager from './components/Harvests/HarvestsManager';
import CalendarView from './components/Calendar/CalendarView';
import RemindersManager from './components/Reminders/RemindersManager';
import AgendaManager from './components/Agenda/AgendaManager';
import PerfilUsuario from './components/UserPerfile/userPerfiles';
import PaymentForm from './components/Payment/PaymentForm';
import AvisoPrivacidad from './components/AvisoPrivacidad';

import PortalCompras from './components/portals/PortalCompras';
import PortalLogistica from './components/portals/PortalLogistica';

const AuthWrapper: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (isLoading) return <div>Cargando...</div>;

  if (!user) {
    return showLogin ? (
      <LoginForm onToggleForm={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onToggleForm={() => setShowLogin(true)} />
    );
  }

  switch (user.role) {
    case 'AGRICULTOR':
      return <MainAppAgricultor />; 
    case 'COMPRADOR':
      return <PortalCompras />;
    case 'LOGISTICA':
      return <PortalLogistica />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1>Rol desconocido: {user.role}</h1>
          <button onClick={logout} className="bg-red-500 text-white p-2 mt-4 rounded">Salir</button>
        </div>
      );
  }
};

const MainAppAgricultor: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'crops': return <CropsManager />;
      case 'harvests': return <HarvestsManager />;
      case 'calendar': return <CalendarView />;
      case 'reminders': return <RemindersManager />;
      case 'agenda': return <AgendaManager />;
      case 'profile': return <PerfilUsuario />;
      case 'payment': return <PaymentForm />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="lg:pl-0">{renderCurrentView()}</div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<AuthWrapper />} />
          <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;