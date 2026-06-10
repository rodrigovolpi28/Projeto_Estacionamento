import { useMemo, useState } from 'react';
import { useParkingStore } from '../store/useParkingStore';
import { ArrowLeft, Calendar, DollarSign, Trash2, type LucideProps, Search } from 'lucide-react';

export default function History({ onNavigate }: { onNavigate: (page: 'dashboard' | 'history') => void }) {
  const { history, clearHistory, removeReceipt } = useParkingStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter globally by search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    
    return history.filter(r => {
      return (
        r.plate.toLowerCase().includes(q) ||
        (r.model && r.model.toLowerCase().includes(q)) ||
        (r.color && r.color.toLowerCase().includes(q)) ||
        (r.vehicleType && r.vehicleType.toLowerCase().includes(q)) ||
        new Date(r.entryTime).toLocaleString('pt-BR').includes(q) ||
        new Date(r.exitTime).toLocaleString('pt-BR').includes(q)
      );
    });
  }, [history, searchQuery]);

  // 2. Group the filtered history by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof history> = {};
    const sorted = [...filteredHistory].sort((a, b) => new Date(b.exitTime).getTime() - new Date(a.exitTime).getTime());
    
    sorted.forEach(receipt => {
      const date = new Date(receipt.exitTime).toLocaleDateString('pt-BR');
      if (!groups[date]) groups[date] = [];
      groups[date].push(receipt);
    });
    
    return groups;
  }, [filteredHistory]);

  const dates = Object.keys(groupedByDate);
  // Auto-select first date if current selection is invalid or empty
  const activeDate = dates.includes(selectedDate || '') ? selectedDate : (dates.length > 0 ? dates[0] : null);
  
  const dailyReceipts = activeDate ? groupedByDate[activeDate] : [];
  const dailyTotal = dailyReceipts.reduce((sum, r) => sum + r.totalPaid, 0);

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <header className="border-b border-dark-border bg-dark-surface p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="text-gray-500 hover:text-white transition-colors p-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white font-mono uppercase tracking-widest font-bold flex items-center gap-2">
            <HistoryIcon className="text-neon-green" size={18} /> Arquivo_Histórico
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar placa, tipo, data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark border border-dark-border text-white pl-10 pr-4 py-2 font-mono text-sm focus:border-neon-green outline-none"
            />
          </div>
          
          {history.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('CUIDADO: Tem certeza que deseja apagar TODO o histórico? Esta ação é irreversível.')) clearHistory();
              }}
              className="text-gray-600 hover:text-neon-red transition-colors flex items-center gap-2 text-xs font-mono uppercase border border-dark-border px-3 py-2 shrink-0"
            >
              <Trash2 size={14} /> Limpar Tudo
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full">
        
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
          <h2 className="text-gray-500 font-mono uppercase text-xs tracking-widest mb-4">Datas ({dates.length})</h2>
          {dates.length === 0 ? (
            <div className="text-gray-600 font-mono text-sm">Nenhum registro.</div>
          ) : (
            dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex items-center justify-between p-4 font-mono text-sm transition-all border ${
                  activeDate === date 
                  ? 'bg-[#151515] border-neon-green text-neon-green' 
                  : 'bg-dark border-dark-border text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="flex items-center gap-2"><Calendar size={14} /> {date}</span>
                <span className="text-xs bg-dark px-2 py-1">{groupedByDate[date].length}</span>
              </button>
            ))
          )}
        </div>

        {activeDate && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            <div className="border border-dark-border bg-[#151515] p-6 mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">Faturamento Filtrado</h3>
                <p className="text-white font-mono">{activeDate}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl text-neon-green font-bold leading-none font-mono flex items-center gap-1 justify-end">
                  {formatBRL(dailyTotal)}
                </span>
              </div>
            </div>

            <div className="border border-dark-border bg-dark-surface overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-border text-gray-500 font-mono text-xs uppercase bg-dark">
                    <th className="p-4 font-normal">Placa</th>
                    <th className="p-4 font-normal">Tipo / Modelo</th>
                    <th className="p-4 font-normal">Período</th>
                    <th className="p-4 font-normal">Tempo</th>
                    <th className="p-4 font-normal text-right">Valor Pago</th>
                    <th className="p-4 font-normal w-12 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReceipts.map(receipt => (
                    <tr key={receipt.id} className="border-b border-dark-border/50 hover:bg-[#151515] transition-colors">
                      <td className="p-4 font-mono font-bold text-white tracking-widest">
                        {receipt.plate}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-sm">
                        {receipt.vehicleType} <span className="text-gray-600">({receipt.model || 'S/M'}{receipt.color ? ` - ${receipt.color}` : ''})</span>
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-xs whitespace-nowrap">
                        {new Date(receipt.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        {' → '} 
                        {new Date(receipt.exitTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-sm whitespace-nowrap">{receipt.totalTimeMinutes} min</td>
                      <td className="p-4 text-neon-green font-mono text-right whitespace-nowrap">{formatBRL(receipt.totalPaid)}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => {
                            if (window.confirm(`Apagar registro de ${receipt.plate}?`)) {
                              removeReceipt(receipt.id);
                            }
                          }}
                          className="text-gray-600 hover:text-neon-red transition-colors p-2"
                          title="Apagar Registro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

function HistoryIcon(props: LucideProps) {
  return <Calendar {...props} />;
}
