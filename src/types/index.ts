export interface User {
  id: string;
  name: string;
  email: string;
  farm: string;
  role: string;
  created_at: string;
  pricePerKm?: number;
  maxCapacity?: number;
}

export interface Crop {
  id: string;
  name: string;
  area: number;
  pricePerUnit: number;
  unit: string;
  sowingDate: string;
  harvestDate: string;
  status: 'active' | 'harvested' | 'sold';
  variety: string;
  farmerName?: string;
  farmerId?: string;
}

export interface Shipment {
  id: string;
  cropName: string;
  cropId: string;
  quantity: number;
  origin: string;
  destination: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'delivered';
  buyerName: string;
  buyerId: string;
  farmerName: string;
  farmerId: string;
  logisticsId?: string; // ID de quien toma el viaje
  date: string;
  totalPrice: number;
  platformFee: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  read: boolean;
  date: string;
}
export interface Harvest {
  id: string;
  cropId: string;
  cropName?: string; // <-- Agregamos esto
  date: string;     // (Opcional, si usas harvestDate)
  harvestDate: string; // <-- Usamos este en el form
  quantity: number;
  unit?: string;     // <-- Agregamos unidad
  quality: string;  // <-- Agregamos calidad
  notes: string;
}
// Auxiliares

export interface Reminder { id: string; title: string; date: string; completed: boolean; type: 'water' | 'fertilize' | 'harvest' | 'other'; }
export interface AgendaItem { id: string; title: string; start: Date; end: Date; allDay?: boolean; description?: string; type: 'meeting' | 'task' | 'visit' | 'other'; }