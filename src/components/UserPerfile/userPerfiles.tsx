import React from 'react';
import { useAuth } from '../../context/AuthContext';

const PerfilUsuario = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center text-red-600 mt-10">No hay sesión activa.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mt-12">
      {/* Encabezado */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h2>
      <div className="flex border-b border-gray-200 mb-6">
        
      </div>

      {/* Imagen del usuario */}
      <div className="flex justify-center mb-6">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>

      {/* Información del usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <label className="block text-gray-500 mb-1">Name</label>
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-500 mb-1">E-mail</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-500 mb-1">Farm</label>
          <input
            type="text"
            value={user.farm}
            disabled
            className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md"
          />
        </div>

        {user.created_at && (
          <div>
            <label className="block text-gray-500 mb-1">Miembro desde</label>
            <input
              type="text"
              value={new Date(user.created_at).toLocaleDateString()}
              disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilUsuario;
