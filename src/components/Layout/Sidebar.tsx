import React from 'react';
import { 
  Home, 
  Sprout, 
  Calendar, 
  Bell, 
  ClipboardList, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  CreditCard,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'crops', icon: Sprout, label: 'Cultivos' },
    { id: 'harvests', icon: BarChart3, label: 'Cosechas' },
    { id: 'calendar', icon: Calendar, label: 'Calendario' },
    { id: 'reminders', icon: Bell, label: 'Recordatorios' },
    { id: 'agenda', icon: ClipboardList, label: 'Agenda' },
    { id: 'payment', icon: CreditCard, label: 'Pagos' },
    { id: 'profile', icon: User, label: 'Mi Perfil' }
  ];

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Fondo oscuro móvil */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-green-800 text-white transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Sprout size={32} className="text-green-300" />
              <span className="text-xl font-bold">AgriRaiz</span>
            </div>
            <div className="mt-4 text-sm text-green-200">
              <p>Bienvenido, {user?.name}</p>
              <p className="text-xs">{user?.farm}</p>
            </div>
          </div>

          {/* Menú */}
          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors
                  ${currentView === item.id 
                    ? 'bg-green-700 text-white' 
                    : 'text-green-100 hover:bg-green-700 hover:text-white'}
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="bg-green-800 px-4 py-4">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-green-800 hover:bg-green-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
