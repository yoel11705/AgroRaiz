import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { LogOut, Truck, Package, XCircle, CheckCircle, DollarSign, User, Navigation, Info, AlertTriangle } from 'lucide-react';

const PortalLogistica: React.FC = () => {
  const { user, logout } = useAuth();
  const { shipments, processShipment } = useData();
  
  // Estado para el Modal de Cotización
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);
  const [distance, setDistance] = useState<string>(''); // En una app real, esto vendría de una API de mapas

  // --- LÓGICA DE FILTRADO PARA MULTI-USUARIO ---
  const myActiveShipments = shipments.filter(s => {
    if (s.status === 'cancelled') return false;
    if (s.status === 'pending') return true;
    if ((s.status === 'accepted' || s.status === 'rejected') && s.logisticsId === user?.id) {
      return true;
    }
    return false;
  });

  // Cálculos de Ganancias
  const calculateEarnings = () => {
    if (!user || !selectedShipment) return { gross: 0, platformFee: 0, net: 0 };
    
    // Usamos la tarifa del usuario o un valor por defecto
    const ratePerKm = user.pricePerKm || 15; 
    const dist = parseFloat(distance) || 0;
    
    // Costo base por distancia
    const transportCost = dist * ratePerKm;
    
    // Costo adicional por peso (opcional, ejemplo simple)
    const weightBonus = (selectedShipment.quantity || 0) * 0.5; 
    
    const gross = transportCost + weightBonus;
    const platformFee = gross * 0.10; // 10% para la plataforma
    const net = gross - platformFee;

    return { gross, platformFee, net };
  };

  const handleAcceptJob = () => {
    if (!selectedShipment) return;
    if (!distance || parseFloat(distance) <= 0) {
      alert("Por favor ingresa la distancia estimada para calcular los costos.");
      return;
    }

    const { net } = calculateEarnings();
    
    if (window.confirm(`¿Aceptas este viaje por una ganancia neta estimada de $${net.toLocaleString()}?`)) {
      processShipment(selectedShipment.id, 'accept');
      setSelectedShipment(null);
      setDistance('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Truck className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Panel Logístico</h1>
              <p className="text-xs text-gray-500">
                {user?.name} • <span className="text-green-600 font-bold">En línea</span>
              </p>
            </div>
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🚛 Bolsa de Cargas</h2>
            <p className="text-gray-500 text-sm mt-1">Encuentra tu próximo viaje y maximiza tus ganancias.</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
            {myActiveShipments.length} Disponibles/Activos
          </span>
        </div>

        {myActiveShipments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Todo tranquilo por aquí</h3>
            <p className="text-gray-500 mb-6">No hay nuevas cargas pendientes ni tienes envíos activos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myActiveShipments.map((shipment) => (
              <div 
                key={shipment.id} 
                className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md ${
                  shipment.status === 'accepted' ? 'border-l-4 border-l-green-500 ring-1 ring-green-100' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 ${
                        shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        shipment.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {shipment.status === 'pending' && <AlertTriangle size={12} />}
                        {shipment.status === 'accepted' && <CheckCircle size={12} />}
                        {shipment.status === 'pending' ? 'Disponible' : 
                         shipment.status === 'accepted' ? 'Asignado a Ti' : 'Rechazado'}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{shipment.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{shipment.cropName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Package size={16} /> {shipment.quantity} Unidades</span>
                      <span className="flex items-center gap-1"><User size={16} /> {shipment.farmerName}</span>
                    </div>
                  </div>

                  {/* Ruta */}
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500 ring-4 ring-white"></div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Origen</p>
                          <p className="text-sm font-medium text-gray-900">{shipment.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Destino</p>
                          <p className="text-sm font-medium text-gray-900">{shipment.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex-1 flex flex-col justify-center gap-3">
                    {shipment.status === 'pending' ? (
                      <>
                        <div className="text-center mb-1">
                          <p className="text-xs text-gray-500">Tarifa Sugerida</p>
                          <p className="text-lg font-bold text-gray-900">A Cotizar</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => { if(window.confirm('¿Rechazar? Desaparecerá de tu lista.')) processShipment(shipment.id, 'reject'); }}
                            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-bold transition-colors"
                          >
                            Ignorar
                          </button>
                          <button 
                            onClick={() => setSelectedShipment(shipment)}
                            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm font-bold shadow-md hover:shadow-lg transition-all"
                          >
                            Cotizar Viaje
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
                        <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                          <CheckCircle size={20} /> Viaje en Curso
                        </p>
                        <button className="mt-2 text-xs text-green-700 underline hover:text-green-800">
                          Ver detalles de entrega
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE COTIZACIÓN */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <DollarSign className="text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold">Cotizar Viaje</h2>
                  <p className="text-gray-400 text-xs">Calcula tus ganancias exactas</p>
                </div>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Input de Distancia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distancia Estimada (km)</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="number" 
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej. 150"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info size={12} /> Tu tarifa actual: <strong>${user?.pricePerKm || 15}/km</strong>
                </p>
              </div>

              {/* Resumen de Costos */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Desglose de Ganancias</h3>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Flete Base ({distance || 0} km * ${user?.pricePerKm || 15})</span>
                  <span>${((parseFloat(distance) || 0) * (user?.pricePerKm || 15)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Bono por Carga ({selectedShipment.quantity} u)</span>
                  <span>${((selectedShipment.quantity || 0) * 0.5).toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <span>Ingreso Bruto</span>
                  <span>${calculateEarnings().gross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-red-500">
                  <span>Comisión Plataforma (10%)</span>
                  <span>-${calculateEarnings().platformFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-green-700">
                  <span>Tu Ganancia Neta</span>
                  <span>${calculateEarnings().net.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleAcceptJob}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Aceptar Viaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalLogistica;