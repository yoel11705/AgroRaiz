import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Bell, Sprout } from 'lucide-react';
import { useData } from '../../context/DataContext';

const CalendarView: React.FC = () => {
  const { crops, reminders, agendaItems } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDay = useMemo(() => {
    const events: { [key: string]: any[] } = {};

    // Agregar recordatorios
    reminders.forEach(reminder => {
      const date = reminder.date;
      if (!events[date]) events[date] = [];
      events[date].push({
        type: 'reminder',
        title: reminder.title,
        data: reminder
      });
    });

    // Agregar items de agenda
    agendaItems.forEach(item => {
      const date = item.date;
      if (!events[date]) events[date] = [];
      events[date].push({
        type: 'agenda',
        title: item.title,
        data: item
      });
    });

    // Agregar fechas de siembra y cosecha de cultivos
    crops.forEach(crop => {
      // Fecha de siembra
      if (!events[crop.plantingDate]) events[crop.plantingDate] = [];
      events[crop.plantingDate].push({
        type: 'planting',
        title: `Siembra: ${crop.name}`,
        data: crop
      });

      // Fecha esperada de cosecha
      if (!events[crop.expectedHarvestDate]) events[crop.expectedHarvestDate] = [];
      events[crop.expectedHarvestDate].push({
        type: 'harvest',
        title: `Cosecha: ${crop.name}`,
        data: crop
      });
    });

    return events;
  }, [crops, reminders, agendaItems]);

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentDate.getFullYear() && 
                          today.getMonth() === currentDate.getMonth();

    const days = [];

    // Espacios vacíos para los días anteriores al primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDay[dateStr] || [];
      const isToday = isCurrentMonth && day === today.getDate();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[100px] border border-gray-200 ${
            isToday ? 'bg-green-50 border-green-300' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-green-700' : 'text-gray-900'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <div
                key={index}
                className={`text-xs p-1 rounded truncate ${
                  event.type === 'reminder' ? 'bg-yellow-100 text-yellow-800' :
                  event.type === 'agenda' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'planting' ? 'bg-green-100 text-green-800' :
                  event.type === 'harvest' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}
                title={event.title}
              >
                {event.type === 'reminder' && <Bell size={10} className="inline mr-1" />}
                {event.type === 'agenda' && <Calendar size={10} className="inline mr-1" />}
                {(event.type === 'planting' || event.type === 'harvest') && <Sprout size={10} className="inline mr-1" />}
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Calendario Agrícola</h1>
        <p className="text-gray-600 mt-2">Vista general de todas tus actividades</p>
      </div>

      {/* Controles del calendario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button
            onClick={goToToday}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Hoy
          </button>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Recordatorios</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span>Agenda</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Siembras</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span>Cosechas</span>
          </div>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Encabezados de los días */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 border-b border-gray-200">
              {day}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Resumen de eventos próximos */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Eventos</h3>
        
        <div className="space-y-3">
          {Object.entries(getEventsForDay)
            .filter(([date]) => new Date(date) >= new Date(new Date().toDateString()))
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .slice(0, 5)
            .map(([date, events]) => (
              <div key={date} className="border-l-4 border-green-500 pl-4">
                <div className="font-medium text-gray-900">
                  {new Date(date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="space-y-1 mt-2">
                  {events.map((event, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      {event.type === 'reminder' && <Bell size={14} className="text-yellow-500" />}
                      {event.type === 'agenda' && <Calendar size={14} className="text-blue-500" />}
                      {(event.type === 'planting' || event.type === 'harvest') && <Sprout size={14} className="text-green-500" />}
                      <span>{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {Object.keys(getEventsForDay).length === 0 && (
          <p className="text-gray-500 text-center py-4">No hay eventos programados</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;