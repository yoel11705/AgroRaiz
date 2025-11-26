import React, { useState } from 'react';
import { Plus, Bell, Check, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Reminder } from '../../types';

const RemindersManager: React.FC = () => {
  const { reminders, addReminder, updateReminder } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'general' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      completed: false
    };

    addReminder(reminderData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'general'
    });
    setShowForm(false);
  };

  const toggleComplete = (id: string, completed: boolean) => {
    updateReminder(id, { completed: !completed });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'irrigation': return 'bg-blue-100 text-blue-800';
      case 'fertilization': return 'bg-green-100 text-green-800';
      case 'pesticide': return 'bg-red-100 text-red-800';
      case 'harvest': return 'bg-yellow-100 text-yellow-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'irrigation': return 'Riego';
      case 'fertilization': return 'Fertilización';
      case 'pesticide': return 'Pesticida';
      case 'harvest': return 'Cosecha';
      case 'general': return 'General';
      default: return type;
    }
  };

  const isOverdue = (date: string, time: string, completed: boolean) => {
    if (completed) return false;
    const reminderDateTime = new Date(`${date}T${time}`);
    return reminderDateTime < new Date();
  };

  const pendingReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recordatorios</h1>
          <p className="text-gray-600 mt-2">Gestiona tus tareas y recordatorios</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nuevo Recordatorio</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{pendingReminders.length}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{completedReminders.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Check size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {pendingReminders.filter(r => isOverdue(r.date, r.time, r.completed)).length}
              </p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nuevo Recordatorio</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Regar tomates, Aplicar fertilizante"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Detalles adicionales del recordatorio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="irrigation">Riego</option>
                    <option value="fertilization">Fertilización</option>
                    <option value="pesticide">Pesticida</option>
                    <option value="harvest">Cosecha</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear Recordatorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Recordatorios */}
      <div className="space-y-6">
        {/* Recordatorios Pendientes */}
        {pendingReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pendientes</h2>
            <div className="space-y-3">
              {pendingReminders.map((reminder) => (
                <div key={reminder.id} className={`bg-white rounded-xl shadow-sm border p-4 ${
                  isOverdue(reminder.date, reminder.time, reminder.completed) 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleComplete(reminder.id, reminder.completed)}
                        className="mt-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                            {getTypeText(reminder.type)}
                          </span>
                          {isOverdue(reminder.date, reminder.time, reminder.completed) && (
                            <AlertTriangle size={16} className="text-red-500" />
                          )}
                        </div>
                        
                        {reminder.description && (
                          <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(reminder.date).toLocaleDateString('es-ES')}</span>
                          <span>{reminder.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recordatorios Completados */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completados</h2>
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
                <div key={reminder.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleComplete(reminder.id, reminder.completed)}
                        className="mt-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 line-through">{reminder.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                            {getTypeText(reminder.type)}
                          </span>
                        </div>
                        
                        {reminder.description && (
                          <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(reminder.date).toLocaleDateString('es-ES')}</span>
                          <span>{reminder.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recordatorios</h3>
          <p className="text-gray-600 mb-4">Crea tu primer recordatorio para estar al día</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Crear Primer Recordatorio
          </button>
        </div>
      )}
    </div>
  );
};

export default RemindersManager;