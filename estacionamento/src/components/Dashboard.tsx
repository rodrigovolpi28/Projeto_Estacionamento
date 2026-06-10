import { useState, useEffect } from 'react';
import { useParkingStore, type Receipt } from '../store/useParkingStore';
import { LogOut, History as HistoryIcon, Car, Clock, Hash, BadgeDollarSign, X, CheckSquare, Settings } from 'lucide-react';
import ReceiptModal from './ReceiptModal';

export default function Dashboard({ onNavigate }: { onNavigate: (page: 'dashboard' | 'history') => void }) {
  const { user, logout, activeTickets, maxCapacity, addTicket, closeTicket, vehicleTypes, addVehicleType, removeVehicleType, updateVehicleTypeRate } = useParkingStore();
  
  const [selectedTypeId, setSelectedTypeId] = useState<string>(vehicleTypes[0]?.id || '');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const [closingTicketId, setClosingTicketId] = useState<string | null>(null);
  const [customExitTime, setCustomExitTime] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeRate, setNewTypeRate] = useState<number>(10);

  // Sync selected type if deleted
  useEffect(() => {
    if (!vehicleTypes.find(t => t.id === selectedTypeId) && vehicleTypes.length > 0) {
      setSelectedTypeId(vehicleTypes[0].id);
    }
  }, [vehicleTypes, selectedTypeId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const availableSpots = maxCapacity - activeTickets.length;

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const type = vehicleTypes.find(t => t.id === selectedTypeId);
    if (!plate.trim() || availableSpots <= 0 || !type) return;
    
    addTicket({
      plate: plate.toUpperCase(),
      model: model.trim() || undefined,
      color: color.trim() || undefined,
      vehicleType: type.name,
      hourlyRate: type.hourlyRate
    });
    
    setPlate('');
    setModel('');
    setColor('');
  };

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim() && newTypeRate > 0) {
      addVehicleType(newTypeName.trim(), newTypeRate);
      setNewTypeName('');
      setNewTypeRate(10);
    }
  };

  const initClose = (ticketId: string) => {
    setClosingTicketId(ticketId);
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setCustomExitTime(localDateTime);
  };

  const confirmClose = () => {
    if (!closingTicketId || !customExitTime) return;
    const exitDate = new Date(customExitTime);
    const generatedReceipt = closeTicket(closingTicketId, exitDate.toISOString());
    if (generatedReceipt) {
      setReceipt(generatedReceipt);
    }
    setClosingTicketId(null);
  };

  const selectedTypeObj = vehicleTypes.find(t => t.id === selectedTypeId);

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <header className="border-b border-dark-border bg-dark-surface p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
          <h1 className="text-white font-mono uppercase tracking-widest font-bold">Sys_Estacionamento</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-500 font-mono text-sm hidden sm:inline-block">Op: {user?.email}</span>
          <button 
            onClick={() => onNavigate('history')}
            className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-mono uppercase"
          >
            <HistoryIcon size={16} /> Histórico
          </button>
          <button 
            onClick={logout}
            className="text-neon-red hover:text-red-400 flex items-center gap-2 transition-colors text-sm font-mono uppercase"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        
        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-dark-surface border border-neon-green w-full max-w-md relative p-6">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute -top-3 -right-3 bg-neon-green text-dark p-1 hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-white font-mono uppercase tracking-widest text-lg mb-6">Tipos de Veículo</h2>
              
              <form onSubmit={handleAddType} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Nome (Ex: SUV)" 
                  value={newTypeName}
                  onChange={e => setNewTypeName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm"
                  required
                />
                <input 
                  type="number" 
                  placeholder="R$" 
                  value={newTypeRate}
                  onChange={e => setNewTypeRate(Number(e.target.value))}
                  className="w-24 px-3 py-2 text-sm"
                  min="1"
                  step="0.5"
                  required
                />
                <button type="submit" className="bg-white text-dark px-4 py-2 text-sm">Add</button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {vehicleTypes.map(t => (
                  <div key={t.id} className="flex flex-col gap-2 bg-dark p-3 border border-dark-border">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-mono text-sm">{t.name}</span>
                      <button 
                        onClick={() => removeVehicleType(t.id)}
                        className="text-neon-red hover:text-white transition-colors"
                        title="Remover Tipo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-mono text-xs">Valor (R$):</span>
                      <input
                        type="number"
                        value={t.hourlyRate}
                        onChange={(e) => updateVehicleTypeRate(t.id, Number(e.target.value))}
                        className="bg-dark-surface border border-dark-border text-neon-green px-2 py-1 text-xs w-24 outline-none focus:border-neon-green font-mono"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 border border-dark-border bg-dark-surface p-6 flex flex-col justify-between">
            <h2 className="text-gray-500 font-mono uppercase text-xs tracking-widest">Vagas Disponíveis</h2>
            <div className="mt-4">
              <span className={`text-7xl md:text-8xl font-mono font-bold leading-none ${availableSpots === 0 ? 'text-neon-red' : 'text-neon-green'}`}>
                {availableSpots}
              </span>
              <span className="text-gray-600 font-mono text-2xl">/20</span>
            </div>
          </div>

          <div className="lg:col-span-3 border border-dark-border bg-dark-surface p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-500 font-mono uppercase text-xs tracking-widest">Registro de Entrada</h2>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-gray-400 hover:text-neon-green transition-colors flex items-center gap-1 text-xs font-mono uppercase"
              >
                <Settings size={14}/> Config Tipos
              </button>
            </div>
            
            <form onSubmit={handleAddTicket} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-[1.5] w-full space-y-2">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1"><Car size={14}/> Tipo Veículo</label>
                <select 
                  value={selectedTypeId}
                  onChange={e => setSelectedTypeId(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border text-neon-green text-xl px-4 py-3 outline-none focus:border-neon-green font-mono"
                  required
                >
                  {vehicleTypes.length === 0 && <option value="" disabled>Cadastre um tipo...</option>}
                  {vehicleTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name} (R$ {t.hourlyRate})</option>
                  ))}
                </select>
              </div>

              <div className="flex-[1] w-full space-y-2">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1"><Clock size={14}/> Entrada</label>
                <div className="w-full bg-dark border border-dark-border text-gray-500 px-4 py-3 font-mono text-xl select-none">
                  {currentTime}
                </div>
              </div>

              <div className="flex-[1.5] w-full space-y-2">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1"><Hash size={14}/> Placa</label>
                <input 
                  type="text" 
                  value={plate}
                  onChange={e => setPlate(e.target.value.toUpperCase())}
                  className="w-full text-white text-xl py-3 uppercase bg-dark border border-dark-border px-4 focus:border-neon-green"
                  placeholder="ABC-1234"
                  maxLength={8}
                  required
                />
              </div>

              <div className="flex-[1] w-full space-y-2">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1"><Car size={14}/> Mod (Opc)</label>
                <input 
                  type="text" 
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full text-white text-xl py-3 bg-dark border border-dark-border px-4 focus:border-neon-green"
                  placeholder="Civic"
                />
              </div>

              <div className="flex-[1] w-full space-y-2">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1"><Settings size={14}/> Cor (Opc)</label>
                <input 
                  type="text" 
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-full text-white text-xl py-3 bg-dark border border-dark-border px-4 focus:border-neon-green"
                  placeholder="Preto"
                />
              </div>

              <button 
                type="submit" 
                disabled={availableSpots === 0 || !plate.trim() || vehicleTypes.length === 0}
                className="w-full md:w-auto bg-white text-dark hover:bg-gray-200 disabled:bg-dark-border disabled:text-gray-600 px-8 py-4 text-sm font-mono tracking-widest font-bold h-[54px]"
              >
                SALVAR
              </button>
            </form>
          </div>
        </div>

        <div className="border border-dark-border bg-dark-surface flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-dark-border">
            <h2 className="text-gray-500 font-mono uppercase text-xs tracking-widest">Veículos em Pátio</h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-gray-500 font-mono text-xs uppercase bg-[#151515]">
                  <th className="p-4 font-normal">Entrada</th>
                  <th className="p-4 font-normal">Placa</th>
                  <th className="p-4 font-normal">Veículo / Tipo</th>
                  <th className="p-4 font-normal">Valor(H)</th>
                  <th className="p-4 font-normal w-64">Saída / Ação</th>
                </tr>
              </thead>
              <tbody>
                {activeTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-600 font-mono text-sm">Nenhum veículo no pátio.</td>
                  </tr>
                ) : (
                  activeTickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-dark-border/50 hover:bg-[#151515] transition-colors group">
                      <td className="p-4 text-gray-300 font-mono">
                        {new Date(ticket.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-4 font-mono font-bold text-white tracking-widest">{ticket.plate}</td>
                      <td className="p-4 text-gray-400 font-mono">
                        {ticket.model ? `${ticket.model} ` : ''}
                        {ticket.color ? `[${ticket.color}] ` : ''}
                        <span className="text-xs border border-gray-600 px-1 rounded-sm ml-2">{ticket.vehicleType || '-'}</span>
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-sm">R$ {ticket.hourlyRate.toFixed(2)}</td>
                      <td className="p-4">
                        {closingTicketId === ticket.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="datetime-local" 
                              value={customExitTime}
                              onChange={(e) => setCustomExitTime(e.target.value)}
                              className="w-full py-2 px-2 text-xs"
                            />
                            <button 
                              onClick={confirmClose}
                              className="bg-neon-red text-white p-2 hover:bg-red-600 transition-colors"
                              title="Confirmar Saída"
                            >
                              <CheckSquare size={16} />
                            </button>
                            <button 
                              onClick={() => setClosingTicketId(null)}
                              className="text-gray-500 hover:text-white p-2 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => initClose(ticket.id)}
                            className="bg-dark-border text-white border border-dark-border hover:border-neon-red hover:text-neon-red w-full py-2 text-xs uppercase tracking-widest transition-colors font-mono"
                          >
                            Fechar Ticket
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}
    </div>
  );
}
