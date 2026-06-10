import { type Receipt } from '../store/useParkingStore';
import { X, Printer } from 'lucide-react';

interface Props {
  receipt: Receipt;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: Props) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-dark-surface border border-neon-green w-full max-w-sm relative shadow-[0_0_50px_rgba(0,255,0,0.1)]">
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-neon-green text-dark p-1 hover:bg-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 flex flex-col font-mono text-gray-300">
          <div className="text-center mb-6 border-b border-dashed border-gray-600 pb-6">
            <h2 className="text-white text-xl uppercase tracking-widest font-bold mb-2">Ticket_Saída</h2>
            <p className="text-xs text-gray-500">ID: {receipt.id.split('-')[0]}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-500">Veículo:</span>
              <span className="text-white font-bold text-right">
                {receipt.plate}
                <div className="text-xs font-normal text-gray-400 mt-1">
                  {receipt.vehicleType} {receipt.model && `(${receipt.model})`} {receipt.color && `[${receipt.color}]`}
                </div>
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Entrada:</span>
              <span className="text-white text-right">{formatTime(receipt.entryTime)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Saída:</span>
              <span className="text-white text-right">{formatTime(receipt.exitTime)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Tempo Total:</span>
              <span className="text-white">{receipt.totalTimeMinutes} min</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Valor Hora:</span>
              <span className="text-white">{formatBRL(receipt.hourlyRate)}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-dashed border-gray-600 flex justify-between items-end">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Total Pago</span>
            <span className="text-3xl text-neon-green font-bold leading-none">
              {formatBRL(receipt.totalPaid)}
            </span>
          </div>

          <button 
            className="mt-8 w-full border border-dark-border py-3 flex items-center justify-center gap-2 hover:bg-[#151515] hover:text-white transition-colors uppercase text-xs tracking-widest"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Imprimir Comprovante
          </button>
        </div>
      </div>
    </div>
  );
}
