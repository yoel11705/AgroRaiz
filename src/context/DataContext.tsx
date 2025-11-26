import React, { createContext, useContext, useState, useEffect } from 'react';
import { Crop, Harvest, Reminder, AgendaItem, Shipment, Notification } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../firebase'; 
import { 
  collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, orderBy 
} from 'firebase/firestore';

interface DataContextType {
  crops: Crop[]; marketCrops: Crop[]; shipments: Shipment[]; notifications: Notification[];
  harvests: Harvest[]; reminders: Reminder[]; agendaItems: AgendaItem[];
  
  addCrop: (crop: Omit<Crop, 'id'>) => void;
  deleteCrop: (id: string) => void;
  reserveCrop: (cropId: string, destination: string, quantity: number) => void;
  processShipment: (shipmentId: string, action: 'accept' | 'reject') => void;
  cancelOrder: (shipmentId: string) => void;
  markNotificationsRead: () => void;

  // Funciones placeholder para el resto (se implementarían igual)
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  addHarvest: (h: Omit<Harvest, 'id'>) => void;
  deleteHarvest: (id: string) => void; // Nueva función
  addReminder: (r: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, u: Partial<Reminder>) => void;
  addAgendaItem: (i: Omit<AgendaItem, 'id'>) => void;
  updateAgendaItem: (id: string, u: Partial<AgendaItem>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Estados
  const [crops, setCrops] = useState<Crop[]>([]);
  const [marketCrops, setMarketCrops] = useState<Crop[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Placeholders
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  // 1. ESCUCHAR EL MERCADO GLOBAL (Público)
  useEffect(() => {
    const qMarket = query(collection(db, "crops")); // Trae todos los cultivos
    const unsubMarket = onSnapshot(qMarket, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Crop));
      setMarketCrops(data);
    });

    const qShipments = query(collection(db, "shipments")); // Trae todos los envíos
    const unsubShipments = onSnapshot(qShipments, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Shipment));
      setShipments(data);
    });

    return () => { unsubMarket(); unsubShipments(); };
  }, []);

  // 2. ESCUCHAR DATOS PRIVADOS (Solo míos)
  useEffect(() => {
    if (!user) {
      setCrops([]); setNotifications([]);
      return;
    }

    // Mis Cultivos (Agricultor)
    const qMyCrops = query(collection(db, "crops"), where("farmerId", "==", user.id));
    const unsubMyCrops = onSnapshot(qMyCrops, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Crop));
      setCrops(data);
    });

    // Mis Notificaciones
    // Nota: Firestore requiere índices para queries complejos. Si falla, usa query simple y filtra en JS
    const qNotifs = query(collection(db, "notifications"), where("userId", "==", user.id));
    const unsubNotifs = onSnapshot(qNotifs, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
      // Ordenamos por fecha reciente en el cliente
      setNotifications(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    // Mis Cosechas
    const qHarvests = query(collection(db, "harvests"), where("farmerId", "==", user.id));
    const unsubHarvests = onSnapshot(qHarvests, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Harvest));
      setHarvests(data);
    });

    // Mis Recordatorios
    const qReminders = query(collection(db, "reminders"), where("userId", "==", user.id));
    const unsubReminders = onSnapshot(qReminders, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Reminder));
      setReminders(data);
    });

    // Mi Agenda
    const qAgenda = query(collection(db, "agenda"), where("userId", "==", user.id));
    const unsubAgenda = onSnapshot(qAgenda, (snapshot) => {
      const data = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        start: d.data().start?.toDate(), // Convertir Timestamp a Date
        end: d.data().end?.toDate()
      } as AgendaItem));
      setAgendaItems(data);
    });

    return () => { unsubMyCrops(); unsubNotifs(); unsubHarvests(); unsubReminders(); unsubAgenda(); };
  }, [user]);

  // --- FUNCIONES (Escriben en Firebase) ---

  const addCrop = async (crop: Omit<Crop, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "crops"), {
        ...crop,
        farmerId: user.id,
        farmerName: user.name,
        status: 'active',
        pricePerUnit: crop.pricePerUnit || 0,
        unit: crop.unit || 'Tonelada',
        createdAt: new Date().toISOString()
      });
    } catch (e) { console.error("Error addCrop:", e); }
  };

  const deleteCrop = async (id: string) => {
    if (!user) return;
    try {
      const cropRef = doc(db, "crops", id);
      await deleteDoc(cropRef);
    } catch (e) { console.error("Error deleteCrop:", e); }
  };

  const reserveCrop = async (cropId: string, destination: string, quantity: number) => {
    if (!user) return;
    
    const targetCrop = marketCrops.find(c => c.id === cropId);
    if (!targetCrop || targetCrop.status === 'sold') {
      alert("Producto no disponible.");
      return;
    }

    const totalPrice = quantity * (targetCrop.pricePerUnit || 0);
    const platformFee = totalPrice * 0.10;

    try {
      await updateDoc(doc(db, "crops", cropId), { status: 'sold' });

      await addDoc(collection(db, "shipments"), {
        cropName: targetCrop.name,
        cropId: targetCrop.id,
        quantity,
        origin: targetCrop.farmerName ? `Finca de ${targetCrop.farmerName}` : 'Origen',
        destination,
        buyerName: user.name,
        buyerId: user.id,
        farmerName: targetCrop.farmerName || 'Agricultor',
        farmerId: targetCrop.farmerId || 'unknown',
        status: 'pending',
        date: new Date().toLocaleDateString(),
        totalPrice,
        platformFee,
        createdAt: new Date().toISOString()
      });

      await addDoc(collection(db, "notifications"), {
        userId: targetCrop.farmerId,
        message: `💰 ¡Venta Exitosa! ${user.name} compró tu ${targetCrop.name} (${quantity} ${targetCrop.unit}s).`,
        type: 'success', read: false, date: new Date().toLocaleDateString()
      });

      alert("Compra realizada. Notificación enviada.");
    } catch (e) { console.error("Error reserveCrop:", e); }
  };

  const processShipment = async (shipmentId: string, action: 'accept' | 'reject') => {
    if (!user) return;
    const ship = shipments.find(s => s.id === shipmentId);
    if (!ship) return;

    if (ship.status === 'accepted' && ship.logisticsId && ship.logisticsId !== user.id) {
      alert("Este viaje ya fue tomado por otro transportista.");
      return;
    }

    try {
      await updateDoc(doc(db, "shipments", shipmentId), {
        status: action === 'accept' ? 'accepted' : 'rejected',
        logisticsId: action === 'accept' ? user.id : null
      });

      if (action === 'accept') {
        await addDoc(collection(db, "notifications"), {
          userId: ship.buyerId, message: `🚚 Envío ACEPTADO para ${ship.cropName}.`, type: 'success', read: false, date: new Date().toLocaleDateString()
        });
        await addDoc(collection(db, "notifications"), {
          userId: ship.farmerId, message: `🚛 Logística asignada para recolección de ${ship.cropName}.`, type: 'info', read: false, date: new Date().toLocaleDateString()
        });
      }
    } catch (e) { console.error("Error processShipment:", e); }
  };

  const cancelOrder = async (shipmentId: string) => {
    const ship = shipments.find(s => s.id === shipmentId);
    if (!ship) return;

    try {
      await updateDoc(doc(db, "shipments", shipmentId), { status: 'cancelled' });
      await updateDoc(doc(db, "crops", ship.cropId), { status: 'active' });
      
      await addDoc(collection(db, "notifications"), {
        userId: ship.farmerId, message: `❌ Venta cancelada por el comprador (${ship.cropName}).`, type: 'error', read: false, date: new Date().toLocaleDateString()
      });
    } catch (e) { console.error("Error cancelOrder:", e); }
  };

  const markNotificationsRead = () => { /* Implementar si se desea */ };

  const updateCrop = async (id: string, d: Partial<Crop>) => { await updateDoc(doc(db, "crops", id), d); };

  // --- IMPLEMENTACIÓN DE COSECHAS ---
  const addHarvest = async (h: Omit<Harvest, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "harvests"), {
        ...h,
        farmerId: user.id,
        createdAt: new Date().toISOString()
      });
    } catch (e) { console.error("Error addHarvest:", e); }
  };

  const deleteHarvest = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "harvests", id));
    } catch (e) { console.error("Error deleteHarvest:", e); }
  };

  // --- IMPLEMENTACIÓN DE RECORDATORIOS Y AGENDA ---
  const addReminder = async (r: Omit<Reminder, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "reminders"), { ...r, userId: user.id });
    } catch (e) { console.error("Error addReminder:", e); }
  };
  
  const updateReminder = async (id: string, u: Partial<Reminder>) => {
    try { await updateDoc(doc(db, "reminders", id), u); } catch (e) { console.error(e); }
  };

  const addAgendaItem = async (i: Omit<AgendaItem, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "agenda"), { ...i, userId: user.id });
    } catch (e) { console.error("Error addAgendaItem:", e); }
  };

  const updateAgendaItem = async (id: string, u: Partial<AgendaItem>) => {
    try { await updateDoc(doc(db, "agenda", id), u); } catch (e) { console.error(e); }
  };

  return (
    <DataContext.Provider value={{ 
      crops, marketCrops, shipments, notifications, harvests, reminders, agendaItems, 
      addCrop, deleteCrop, reserveCrop, processShipment, cancelOrder, markNotificationsRead,
      updateCrop, addHarvest, deleteHarvest, addReminder, updateReminder, addAgendaItem, updateAgendaItem 
    }}>
      {children}
    </DataContext.Provider>
  );
};