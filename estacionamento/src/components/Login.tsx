import { useState } from 'react';
import { useParkingStore } from '../store/useParkingStore';
import { Lock, UserPlus } from 'lucide-react';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const login = useParkingStore(state => state.login);
  const register = useParkingStore(state => state.register);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email.trim() && password.trim()) {
      if (isRegistering) {
        const success = register(email, password);
        if (success) {
          // auto login after register
          login(email, password);
        } else {
          setError('E-mail já está em uso.');
        }
      } else {
        const success = login(email, password);
        if (!success) {
          setError('Credenciais inválidas.');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-dark-surface border border-dark-border p-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-neon-green" />
        
        <div className="flex items-center gap-3 mb-8">
          {isRegistering ? <UserPlus className="text-neon-green" size={28} /> : <Lock className="text-neon-green" size={28} />}
          <h1 className="text-2xl font-mono text-white tracking-widest uppercase">
            {isRegistering ? 'Novo_Operador' : 'Acesso_Restrito'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-neon-red text-neon-red font-mono text-sm">
            ERRO: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider block">Identificação (E-mail)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark border border-dark-border text-neon-green px-4 py-3 focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
              placeholder="operador@sistema.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider block">Código de Segurança</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark border border-dark-border text-white px-4 py-3 focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all font-mono tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-neon-green text-dark font-mono font-bold uppercase tracking-widest py-4 hover:bg-opacity-80 transition-colors active:scale-[0.98]"
          >
            {isRegistering ? 'Registrar & Acessar' : 'Autorizar Acesso'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="w-full text-xs text-center text-gray-500 font-mono mt-4 hover:text-white transition-colors"
          >
            {isRegistering 
              ? 'Voltar para tela de login' 
              : 'Não possui conta? Criar acesso de operador.'}
          </button>
        </form>
      </div>
    </div>
  );
}
