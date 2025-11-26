import React from 'react';
import { BarChart3, Calendar, Bell, Sprout, TrendingUp, AlertTriangle, Plus, ArrowRight, Leaf, Droplets, Package } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const { crops, harvests, reminders, agendaItems } = useData();

  const activeCrops = crops.filter(crop => crop.status === 'active');
  const pendingReminders = reminders.filter(reminder => !reminder.completed);
  // AgendaItems don't have 'completed', filter by future dates
  const pendingAgendaItems = agendaItems.filter(item => new Date(item.start) >= new Date());
  const totalHarvestQuantity = harvests.reduce((sum, harvest) => sum + harvest.quantity, 0);

  const upcomingTasks = [
    ...pendingReminders.slice(0, 3).map(r => ({ 
      title: r.title, 
      date: new Date(r.date), 
      type: 'reminder' 
    })),
    ...pendingAgendaItems.slice(0, 3).map(a => ({ 
      title: a.title, 
      date: new Date(a.start), 
      type: 'agenda' 
    }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);

  const stats = [
    {
      title: 'Cultivos Activos',
      value: activeCrops.length,
      icon: Sprout,
      gradient: 'from-green-500 to-emerald-700',
      change: '+2 este mes'
    },
    {
      title: 'Cosechas Totales',
      value: harvests.length,
      icon: BarChart3,
      gradient: 'from-blue-500 to-indigo-700',
      change: '+5 registros'
    },
    {
      title: 'Recordatorios',
      value: pendingReminders.length,
      icon: Bell,
      gradient: 'from-orange-400 to-red-500',
      change: 'Pendientes'
    },
    {
      title: 'Tareas Agenda',
      value: pendingAgendaItems.length,
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-600',
      change: 'Futuras'
    }
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Agrícola</h1>
          <p className="text-gray-600 mt-1">Bienvenido de nuevo. Aquí está el resumen de tu finca.</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          📅 {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid con Gradientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden rounded-2xl shadow-lg p-6 text-white bg-gradient-to-br ${stat.gradient} transition-transform hover:scale-[1.02]`}>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-4xl font-bold">{stat.value}</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-50 font-medium">
                <TrendingUp size={16} className="mr-1" />
                {stat.change}
              </div>
            </div>
            {/* Decoración de fondo */}
            <div className="absolute -bottom-4 -right-4 opacity-10 transform rotate-12">
              <stat.icon size={100} />
            </div>
          </div>
        ))}
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} /> Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="bg-green-100 p-3 rounded-full mb-2 group-hover:bg-green-200 transition-colors">
              <Plus className="text-green-600" size={24} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-green-700">Nuevo Cultivo</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="bg-blue-100 p-3 rounded-full mb-2 group-hover:bg-blue-200 transition-colors">
              <Package className="text-blue-600" size={24} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-blue-700">Registrar Cosecha</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div className="bg-orange-100 p-3 rounded-full mb-2 group-hover:bg-orange-200 transition-colors">
              <Droplets className="text-orange-600" size={24} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-orange-700">Riego / Tarea</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <div className="bg-purple-100 p-3 rounded-full mb-2 group-hover:bg-purple-200 transition-colors">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <span className="font-medium text-gray-700 group-hover:text-purple-700">Ver Agenda</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cultivos Activos (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Leaf className="text-green-600" size={20} /> Cultivos en Curso
            </h3>
            <button className="text-sm text-green-600 font-medium hover:underline flex items-center">
              Ver todos <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {activeCrops.slice(0, 4).map((crop) => (
              <div key={crop.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mr-4">
                  🌱
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-bold text-gray-900">{crop.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-full font-bold bg-green-100 text-green-700">
                      En Curso
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{crop.variety} • {crop.area} {crop.unit || 'ha'}</p>
                  
                  {/* Barra de Progreso Simulada */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.random() * 60 + 20}%` }} 
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {activeCrops.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Sprout size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No tienes cultivos activos actualmente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Próximas Tareas (Ocupa 1 columna) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="text-orange-500" size={20} /> Agenda Pendiente
          </h3>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className={`mt-1 p-2 rounded-lg ${task.type === 'reminder' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                  {task.type === 'reminder' ? <AlertTriangle size={16} /> : <Calendar size={16} />}
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">{task.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {task.date < new Date() && <span className="text-red-500 font-bold ml-2">¡Vencido!</span>}
                  </p>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-gray-500 text-center text-sm">¡Todo al día! No hay tareas pendientes.</p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Total Cosechado</p>
                   <p className="text-2xl font-bold text-gray-900">{totalHarvestQuantity.toLocaleString()} kg</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                   <BarChart3 className="text-blue-600" size={20} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;