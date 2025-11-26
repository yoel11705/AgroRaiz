import React from 'react';
import { useData } from '../context/DataContext';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';

const NotificationPanel: React.FC = () => {
  const { notifications } = useData();

  if (notifications.length === 0) return null;

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Bell size={16} className="text-blue-600" /> Notificaciones Recientes
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-3 rounded flex items-start gap-3 text-sm ${
            notif.type === 'success' ? 'bg-green-50 text-green-800' :
            notif.type === 'error' ? 'bg-red-50 text-red-800' :
            notif.type === 'warning' ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
          }`}>
            <div className="mt-0.5">
              {notif.type === 'success' && <CheckCircle size={14} />}
              {notif.type === 'error' && <XCircle size={14} />}
              {(notif.type === 'info' || notif.type === 'warning') && <Info size={14} />}
            </div>
            <div>
              <p>{notif.message}</p>
              <span className="text-xs opacity-60">{notif.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;