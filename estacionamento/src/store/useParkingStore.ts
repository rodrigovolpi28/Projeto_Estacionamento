import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  email: string;
}

export interface VehicleType {
  id: string;
  name: string;
  hourlyRate: number;
}

export interface Ticket {
  id: string;
  entryTime: string; // ISO string
  plate: string;
  model?: string;
  color?: string;
  vehicleType: string;
  hourlyRate: number;
}

export interface Receipt extends Ticket {
  exitTime: string; // ISO string
  totalTimeMinutes: number;
  totalPaid: number;
}

interface ParkingState {
  user: User | null;
  registeredUsers: Record<string, string>; // email -> password
  
  vehicleTypes: VehicleType[];
  activeTickets: Ticket[];
  history: Receipt[];
  maxCapacity: number;
  
  register: (email: string, password: string) => boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  
  addVehicleType: (name: string, hourlyRate: number) => void;
  removeVehicleType: (id: string) => void;
  updateVehicleTypeRate: (id: string, newRate: number) => void;

  addTicket: (ticket: Omit<Ticket, 'id' | 'entryTime'>) => void;
  closeTicket: (ticketId: string, exitTime: string) => Receipt | null;
  
  removeReceipt: (receiptId: string) => void;
  clearHistory: () => void;
}

export const useParkingStore = create<ParkingState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: {},
      
      vehicleTypes: [
        { id: '1', name: 'Carro Padrão', hourlyRate: 10 },
        { id: '2', name: 'Moto', hourlyRate: 5 }
      ],
      activeTickets: [],
      history: [],
      maxCapacity: 20,
      
      register: (email, password) => {
        const users = get().registeredUsers;
        if (users[email]) return false; // already exists
        
        set({
          registeredUsers: { ...users, [email]: password }
        });
        return true;
      },

      login: (email, password) => {
        const users = get().registeredUsers;
        if (users[email] && users[email] === password) {
          set({ user: { email } });
          return true;
        }
        return false;
      },
      
      logout: () => set({ user: null }),

      addVehicleType: (name, hourlyRate) => {
        const newType: VehicleType = {
          id: crypto.randomUUID(),
          name,
          hourlyRate
        };
        set((state) => ({
          vehicleTypes: [...state.vehicleTypes, newType]
        }));
      },

      removeVehicleType: (id) => {
        set((state) => ({
          vehicleTypes: state.vehicleTypes.filter(t => t.id !== id)
        }));
      },
      
      updateVehicleTypeRate: (id, newRate) => {
        set((state) => ({
          vehicleTypes: state.vehicleTypes.map(t => 
            t.id === id ? { ...t, hourlyRate: newRate } : t
          )
        }));
      },
      
      addTicket: (data) => {
        const newTicket: Ticket = {
          ...data,
          id: crypto.randomUUID(),
          entryTime: new Date().toISOString(),
        };
        
        set((state) => ({
          activeTickets: [...state.activeTickets, newTicket]
        }));
      },
      
      closeTicket: (ticketId, exitTime) => {
        const state = get();
        const ticket = state.activeTickets.find(t => t.id === ticketId);
        
        if (!ticket) return null;
        
        const entry = new Date(ticket.entryTime);
        const exit = new Date(exitTime);
        
        // Ensure exit isn't before entry
        if (exit < entry) return null;
        
        const diffMs = exit.getTime() - entry.getTime();
        const diffMinutes = Math.max(1, Math.ceil(diffMs / (1000 * 60))); 
        
        let totalPaid = 0;
        
        if (diffMinutes <= 60) {
          totalPaid = ticket.hourlyRate;
        } else {
          // Fracionamento de 15 em 15 minutos
          const extraMinutes = diffMinutes - 60;
          const fractionBlocks = Math.ceil(extraMinutes / 15);
          const billedExtraMinutes = fractionBlocks * 15;
          
          const pricePerMinute = ticket.hourlyRate / 60;
          totalPaid = ticket.hourlyRate + (billedExtraMinutes * pricePerMinute);
        }
        
        // format to 2 decimal places
        totalPaid = Math.round(totalPaid * 100) / 100;
        
        const receipt: Receipt = {
          ...ticket,
          exitTime,
          totalTimeMinutes: diffMinutes,
          totalPaid
        };
        
        set((state) => ({
          activeTickets: state.activeTickets.filter(t => t.id !== ticketId),
          history: [...state.history, receipt]
        }));
        
        return receipt;
      },
      
      removeReceipt: (receiptId) => {
        set((state) => ({
          history: state.history.filter(r => r.id !== receiptId)
        }));
      },

      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'parking-storage',
    }
  )
);
