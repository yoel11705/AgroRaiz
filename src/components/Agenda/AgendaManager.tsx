import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Flag, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AgendaItem } from '../../types';

const AgendaManager: React.FC = () => {
  const { agendaItems, addAgendaItem, updateAgendaItem } = useData();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      priority: formData.priority,
      completed: false
    };

    addAgendaItem(itemData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    });
    setShowForm(false);
  };

  const toggleComplete = (id: string, completed: boolean) => {
    updateAgendaItem(id, { completed: !completed });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const filteredItems = agendaItems.filter(item => {
    if (filter === 'pending') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  }).sort((a, b) => {
    // Primero por completado (no completados primero)
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Luego por fecha
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const pendingItems = agendaItems.filter(item => !item.completed);
  const completedItems = agendaItems.filter(item => item.completed);
  const highPriorityItems = pendingItems.filter(item => item.priority === 'high');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600 mt-2">Gestiona tus tareas y actividades</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{pendingItems.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Circle size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{completedItems.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alta Prioridad</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{highPriorityItems.length}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Flag size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({agendaItems.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'pending' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendientes ({pendingItems.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'completed' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completadas ({completedItems.length})
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nueva Tarea</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Tarea
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Revisar sistema de riego, Comprar semillas"
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
                  placeholder="Detalles adicionales de la tarea"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
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
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Tareas */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${
            item.completed ? 'opacity-75 bg-gray-50' : ''
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => toggleComplete(item.id, item.completed)}
                  className="mt-1 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Circle size={20} className="text-gray-400 hover:text-green-500" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`font-semibold ${
                      item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                      {getPriorityText(item.priority)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className={`text-sm mb-2 ${
                      item.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
                    {new Date(item.date) < new Date() && !item.completed && (
                      <span className="text-red-500 font-medium">Vencida</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No hay tareas' : 
             filter === 'pending' ? 'No hay tareas pendientes' : 
             'No hay tareas completadas'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' && 'Crea tu primera tarea para organizar tu trabajo'}
            {filter === 'pending' && 'Todas las tareas están completadas'}
            {filter === 'completed' && 'Aún no has completado ninguna tarea'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Crear Primera Tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AgendaManager;