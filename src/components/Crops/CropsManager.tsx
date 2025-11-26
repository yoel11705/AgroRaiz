import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, DollarSign, Scale, Lock } from 'lucide-react'; 
import { useData } from '../../context/DataContext';
import { Crop } from '../../types';

const CropsManager: React.FC = () => {
  const { crops, addCrop, updateCrop, deleteCrop } = useData(); // <--- Importamos deleteCrop
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', variety: '', area: '', plantingDate: '', expectedHarvestDate: '',
    status: 'planted' as const, notes: '', pricePerUnit: '', unit: 'Tonelada'
  });

  // ... (handleSubmit y resetForm iguales) ...
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cropData = {
      name: formData.name, variety: formData.variety, area: parseFloat(formData.area),
      plantingDate: formData.plantingDate, expectedHarvestDate: formData.expectedHarvestDate,
      status: formData.status, notes: formData.notes,
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0, unit: formData.unit
    };
    if (editingCrop) updateCrop(editingCrop.id, cropData);
    else addCrop(cropData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', variety: '', area: '', plantingDate: '', expectedHarvestDate: '', status: 'planted', notes: '', pricePerUnit: '', unit: 'Tonelada' });
    setShowForm(false); setEditingCrop(null);
  };

  const handleEdit = (crop: Crop) => {
    setFormData({
      name: crop.name, variety: crop.variety, area: crop.area.toString(),
      plantingDate: crop.plantingDate, expectedHarvestDate: crop.expectedHarvestDate,
      status: crop.status, notes: crop.notes,
      pricePerUnit: crop.pricePerUnit ? crop.pricePerUnit.toString() : '', unit: crop.unit || 'Tonelada'
    });
    setEditingCrop(crop); setShowForm(true);
  };

  // --- NUEVA LÓGICA DE ELIMINAR ---
  const handleDelete = (crop: Crop) => {
    if (crop.status === 'sold') {
      alert("🚫 No puedes eliminar este cultivo porque ya fue VENDIDO. Contacta a soporte si es un error.");
      return;
    }
    if (window.confirm(`¿Seguro que quieres eliminar el cultivo ${crop.name}?`)) {
      deleteCrop(crop.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-red-100 text-red-800 border-red-200'; // Vendido resalta
      case 'ready': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cultivos</h1>
          <p className="text-gray-600 mt-2">Administra tus siembras y ventas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Plus size={20} /> <span>Nuevo Cultivo</span>
        </button>
      </div>

      {/* (El Modal del Formulario se mantiene IGUAL, pégalo aquí...) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingCrop ? 'Editar' : 'Nuevo'} Cultivo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* ... (Inputs del formulario igual que antes) ... */}
               {/* Para brevedad, asumo que copias el formulario del mensaje anterior aquí */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Nombre</label><input className="w-full p-2 border rounded" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium">Variedad</label><input className="w-full p-2 border rounded" value={formData.variety} onChange={e=>setFormData({...formData, variety: e.target.value})} /></div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 <div><label className="block text-sm font-medium">Area</label><input type="number" className="w-full p-2 border rounded" value={formData.area} onChange={e=>setFormData({...formData, area: e.target.value})} /></div>
                 <div><label className="block text-sm font-medium">Unidad</label><select className="w-full p-2 border rounded" value={formData.unit} onChange={e=>setFormData({...formData, unit: e.target.value})}><option>Tonelada</option><option>Kg</option></select></div>
                 <div><label className="block text-sm font-medium">Precio ($)</label><input type="number" className="w-full p-2 border rounded" value={formData.pricePerUnit} onChange={e=>setFormData({...formData, pricePerUnit: e.target.value})} /></div>
               </div>
               <div className="flex justify-end gap-2 mt-4">
                 <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Cultivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop.id} className={`bg-white rounded-xl shadow-sm border p-6 relative ${crop.status === 'sold' ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
            
            {/* Etiqueta VENDIDO */}
            {crop.status === 'sold' && (
              <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow animate-pulse">
                VENDIDO
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
              <p className="text-gray-600">{crop.variety}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Cantidad:</span>
                <span className="font-medium">{crop.area} {crop.unit}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Precio:</span>
                <span className="font-medium text-green-700">${crop.pricePerUnit}/{crop.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cosecha:</span>
                <span>{crop.expectedHarvestDate}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 flex justify-end space-x-2 border-t pt-4">
              {crop.status !== 'sold' ? (
                <>
                  <button onClick={() => handleEdit(crop)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(crop)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 text-xs italic">
                  <Lock size={14} /> Acciones bloqueadas (Vendido)
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropsManager;