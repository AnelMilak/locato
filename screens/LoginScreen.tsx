import React, { useState } from 'react';
import { Mail, Lock, Coffee, Utensils, Heart } from 'lucide-react';
import { Input, Button } from '../components/Shared';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-orange-400 via-orange-300 to-red-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Utensils className="absolute top-10 left-10 text-white w-24 h-24 rotate-12" />
        <Coffee className="absolute bottom-20 right-10 text-white w-32 h-32 -rotate-12" />
      </div>

      <div className="bg-white/90 backdrop-blur-sm w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl z-10 animate-fade-in-up">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <div className="text-orange-500 font-bold text-2xl flex items-center gap-1">
                <span className="bg-orange-500 text-white rounded-full p-1"><Utensils size={16} /></span>
                Locato
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">Pronađi najbolja mjesta za jelo & piće</p>

          <div className="my-6">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full mx-auto flex items-center justify-center mb-2">
              <Coffee size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Dobrodošli nazad!</h1>
            <p className="text-gray-400 text-sm">Nastavi avanturu</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email adresa"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Lozinka"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="mt-4">
            Prijavi se
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Nemaš račun? <a href="#" className="text-orange-500 font-semibold hover:underline">Registruj se</a>
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 flex gap-6 text-white/50">
        <Heart size={24} />
        <Coffee size={24} />
        <Utensils size={24} />
      </div>
    </div>
  );
};

export default LoginScreen;
