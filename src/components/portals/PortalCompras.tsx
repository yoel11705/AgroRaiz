import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { LogOut, ShoppingCart, Sprout, MapPin, Calendar, DollarSign, XCircle, Truck, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import NotificationPanel from '../../components/NotificationPanel';

const PortalCompras: React.FC = () => {
  const { user, logout } = useAuth();
  const { marketCrops, reserveCrop, shipments, cancelOrder } = useData(); 
  
  // Estado para el Modal de Compra
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [step, setStep] = useState<'details' | 'confirm'>('details');

  const availableCrops = marketCrops.filter(c => c.status === 'active');
  const myOrders = shipments.filter(s => s.buyerId === user?.id && s.status !== 'cancelled');

  // Abrir Modal
  const openPurchaseModal = (crop: any) => {
    setSelectedCrop(crop);
    setQuantity(crop.area.toString()); // Por defecto todo lo disponible
    setDestination('');
    setStep('details');
  };

  // Cerrar Modal
  const closeModal = () => {
    setSelectedCrop(null);
    setQuantity('');
    setDestination('');
  };

  // Cálculos de la Factura
  const getInvoiceDetails = () => {
    if (!selectedCrop) return { subtotal: 0, fee: 0, total: 0, shippingEstimate: 0 };
    const qty = parseFloat(quantity) || 0;
    const subtotal = qty * selectedCrop.pricePerUnit;
    const fee = subtotal * 0.10; // 10% tarifa de plataforma
    const shippingEstimate = 150; // Costo base de envío estimado (ejemplo)
    const total = subtotal + fee + shippingEstimate;
    return { subtotal, fee, shippingEstimate, total };
  };

  const handleConfirmPurchase = () => {
    if (!selectedCrop) return;
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0 || qty > selectedCrop.area) {
      alert("Cantidad inválida");
      return;
    }
    if (!destination.trim()) {
      alert("Por favor ingresa una dirección de entrega");
      return;
    }

    reserveCrop(selectedCrop.id, destination, qty);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <ShoppingCart className="text-green-600 h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Portal de Compras</h1>
              <p className="text-xs text-gray-500">Mercado de Cosechas</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">Hola, {user?.name}</span>
            <button 
              onClick={logout} 
              className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <NotificationPanel />

        {/* SECCIÓN 1: MIS PEDIDOS PENDIENTES */}
        {myOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">📦 Mis Pedidos Activos</h2>
            <div className="grid grid-cols-1 gap-4">
              {myOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-blue-50 p-3 rounded-full hidden sm:block">
                      <Truck className="text-blue-600 h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{order.cropName}</h3>
                      <p className="text-sm text-gray-500 mb-2">Orden #{order.id.slice(0, 8)}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Qty: <strong>{order.quantity}</strong></span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Total: <strong>${order.totalPrice.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-[200px]">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      order.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending' && <AlertCircle size={14} />}
                      {order.status === 'accepted' && <CheckCircle size={14} />}
                      {order.status === 'pending' ? 'Esperando Logística' :
                       order.status === 'accepted' ? 'En Camino' :
                       order.status === 'rejected' ? 'Rechazado' : order.status}
                    </span>

                    {order.status === 'pending' && (
                      <button 
                        onClick={() => { if(window.confirm("¿Seguro que deseas cancelar este pedido?")) cancelOrder(order.id) }}
                        className="text-red-500 text-xs font-medium hover:text-red-700 hover:underline flex items-center gap-1"
                      >
                        <XCircle size={14} /> Cancelar Solicitud
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 2: MERCADO DISPONIBLE */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🌱 Mercado Disponible</h2>
            <p className="text-gray-500 text-sm mt-1">Explora las mejores cosechas directo del campo.</p>
          </div>
          <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            {availableCrops.length} Lotes Disponibles
          </span>
        </div>
        
        {availableCrops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Todo se ha vendido</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              No hay ofertas disponibles en este momento. Los agricultores están trabajando en nuevas cosechas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCrops.map((crop) => (
              <div key={crop.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                
                {/* Banner Imagen */}
                <div className="h-40 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <Sprout className="text-white/90 h-16 w-16 transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-800 shadow-sm">
                    ${crop.pricePerUnit} <span className="text-xs font-normal text-gray-500">/ {crop.unit}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{crop.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">{crop.variety}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-gray-600 text-sm bg-gray-50 p-2 rounded-lg">
                      <MapPin size={16} className="text-gray-400" />
                      <span>Cantidad: <strong className="text-gray-900">{crop.area} {crop.unit}s</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm bg-gray-50 p-2 rounded-lg">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Cosecha: <strong className="text-gray-900">{crop.harvestDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm bg-gray-50 p-2 rounded-lg">
                      <CheckCircle size={16} className="text-gray-400" />
                      <span>Vendedor: <strong className="text-gray-900">{crop.farmerName || 'Verificado'}</strong></span>
                    </div>
                  </div>

                  <button 
                    onClick={() => openPurchaseModal(crop)}
                    className="w-full bg-gray-900 text-white py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-200 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Comprar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL DE COMPRA MEJORADO */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-emerald-400" />
                <div>
                  <h2 className="text-xl font-bold">Resumen de Compra</h2>
                  <p className="text-gray-400 text-xs">Completa los detalles para generar tu orden</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Columna Izquierda: Formulario */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Producto Seleccionado</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="bg-emerald-100 p-2 rounded-md">
                        <Sprout className="text-emerald-600 h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{selectedCrop.name}</p>
                        <p className="text-xs text-gray-500">{selectedCrop.variety} • ${selectedCrop.pricePerUnit}/{selectedCrop.unit}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad a Comprar ({selectedCrop.unit}s)</label>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      max={selectedCrop.area}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">Disponible: {selectedCrop.area} {selectedCrop.unit}s</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                    <textarea 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Calle, Número, Ciudad, Estado..."
                    />
                  </div>
                </div>

                {/* Columna Derecha: Factura */}
                <div className="w-full md:w-72 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b pb-2">Desglose de Costos</h3>
                  
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${getInvoiceDetails().subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tarifa Plataforma (10%)</span>
                      <span>${getInvoiceDetails().fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Envío Estimado</span>
                      <span>${getInvoiceDetails().shippingEstimate.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>${getInvoiceDetails().total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirmPurchase}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Confirmar Pedido
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">
                    Al confirmar, aceptas los términos de servicio.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalCompras;