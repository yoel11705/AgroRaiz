import React, { useState } from 'react';
import { Plus, BarChart3, Calendar, Package, Trash2, Filter, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Harvest } from '../../types';

const HarvestsManager: React.FC = () => {
  const { crops, harvests, addHarvest, deleteHarvest } = useData(); // Asegúrate de que deleteHarvest exista en el contexto
  const [showForm, setShowForm] = useState(false);
  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [filterQuality, setFilterQuality] = useState<string>('all');

  const [formData, setFormData] = useState({
    cropId: '',
    quantity: '',
    unit: 'kg',
    harvestDate: new Date().toISOString().split('T')[0],
    quality: 'good' as const,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCrop = crops.find(c => c.id === formData.cropId);
    if (!selectedCrop) return;

    const harvestData = {
      cropId: formData.cropId,
      cropName: selectedCrop.name,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      harvestDate: formData.harvestDate,
      date: formData.harvestDate, // Added missing date property
      quality: formData.quality,
      notes: formData.notes
    };

    addHarvest(harvestData);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de cosecha?')) {
      if (deleteHarvest) {
        deleteHarvest(id);
      } else {
        alert("La función de eliminar no está disponible en este momento.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cropId: '',
      quantity: '',
      unit: 'kg',
      harvestDate: new Date().toISOString().split('T')[0],
      quality: 'good',
      notes: ''
    });
    setShowForm(false);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'fair': return 'Regular';
      case 'poor': return 'Pobre';
      default: return quality;
    }
  };

  // Filtrado
  const filteredHarvests = harvests.filter(h => {
    const matchCrop = filterCrop === 'all' || h.cropId === filterCrop;
    const matchQuality = filterQuality === 'all' || h.quality === filterQuality;
    return matchCrop && matchQuality;
  });

  // Estadísticas
  const totalQuantity = filteredHarvests.reduce((sum, h) => sum + (h.quantity || 0), 0);
  const maxQuantity = Math.max(...harvests.map(h => h.quantity || 0), 1); // Para escalar el gráfico

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cosechas</h1>
          <p className="text-gray-600 mt-1">Registra, monitorea y analiza tu producción.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm font-medium"
        >
          <Plus size={20} />
          <span>Nueva Cosecha</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Filter size={20} />
          <span className="font-medium">Filtrar por:</span>
        </div>
        <select
          value={filterCrop}
          onChange={(e) => setFilterCrop(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="all">Todos los Cultivos</option>
          {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={filterQuality}
          onChange={(e) => setFilterQuality(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="all">Todas las Calidades</option>
          <option value="excellent">Excelente</option>
          <option value="good">Buena</option>
          <option value="fair">Regular</option>
          <option value="poor">Pobre</option>
        </select>
        {(filterCrop !== 'all' || filterQuality !== 'all') && (
          <button 
            onClick={() => { setFilterCrop('all'); setFilterQuality('all'); }}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <X size={16} /> Limpiar
          </button>
        )}
      </div>

      {/* Gráfico Visual Simple */}
      {filteredHarvests.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} /> Producción Reciente
          </h3>
          <div className="flex items-end gap-2 h-40 overflow-x-auto pb-2">
            {filteredHarvests.slice(0, 10).map((h) => (
              <div key={h.id} className="flex flex-col items-center gap-1 group min-w-[60px]">
                <div 
                  className="w-full bg-blue-100 rounded-t-lg transition-all group-hover:bg-blue-200 relative"
                  style={{ height: `${(h.quantity / maxQuantity) * 100}%`, minHeight: '20px' }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {h.quantity} {h.unit}
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate w-full text-center">{new Date(h.harvestDate).toLocaleDateString(undefined, {day: '2-digit', month: '2-digit'})}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Registros */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Historial ({filteredHarvests.length})
          {filterCrop !== 'all' && <span className="text-sm font-normal text-gray-500 ml-2">Filtrado por cultivo</span>}
        </h2>
        
        {filteredHarvests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron cosechas</h3>
            <p className="text-gray-500 mt-1">Intenta cambiar los filtros o registra una nueva.</p>
          </div>
        ) : (
          filteredHarvests.map((harvest) => (
            <div key={harvest.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{harvest.cropName || 'Cultivo Desconocido'}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getQualityColor(harvest.quality as string)}`}>
                      {getQualityText(harvest.quality as string)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                      <Package size={16} className="text-green-600" />
                      <span className="font-medium text-gray-900">{harvest.quantity} {harvest.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                      <Calendar size={16} className="text-blue-600" />
                      <span>{new Date(harvest.harvestDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  {harvest.notes && (
                    <div className="mt-3 text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">
                      "{harvest.notes}"
                    </div>
                  )}
                </div>

                <div>
                  <button 
                    onClick={() => handleDelete(harvest.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Eliminar registro"
                  >
                    <Trash2 size={20} />
                  </button>
                </div> 
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Formulario (Mismo que antes) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Registrar Nueva Cosecha</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cultivo Origen</label>
                <select
                  value={formData.cropId}
                  onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">-- Selecciona un cultivo --</option>
                  {crops.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} ({crop.variety}) - {crop.area} ha
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="ton">Toneladas (ton)</option>
                    <option value="cajas">Cajas</option>
                    <option value="sacos">Sacos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Cosecha</label>
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calidad</label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="excellent">Excelente</option>
                    <option value="good">Buena</option>
                    <option value="fair">Regular</option>
                    <option value="poor">Pobre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observaciones</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Detalles sobre el rendimiento, clima, etc."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                >
                  Guardar Cosecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarvestsManager;