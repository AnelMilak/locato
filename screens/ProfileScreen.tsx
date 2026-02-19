import React, { useState } from 'react';
import { User, Settings, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, History, ArrowLeft, Save, Shield, Globe, Moon, CreditCard as CardIcon, MessageCircle, ChevronDown, Sun } from 'lucide-react';
import { Button, Input, Badge } from '../components/Shared';
import { useTheme } from '../context/ThemeContext';

interface ProfileScreenProps {
  onLogout: () => void;
}

type SubView = 'main' | 'personal' | 'history' | 'payment' | 'notifications' | 'settings' | 'help';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<SubView>('main');
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'personal', icon: User, label: 'Lični podaci', sub: 'Izmijeni ime, email...' },
    { id: 'history', icon: History, label: 'Historija rezervacija', sub: 'Pregledaj prošle posjete' },
    { id: 'payment', icon: CreditCard, label: 'Plaćanje', sub: 'Kartice i novčanik' },
    { id: 'notifications', icon: Bell, label: 'Obavijesti', sub: 'Upravljaj notifikacijama' },
    { id: 'settings', icon: Settings, label: 'Postavke', sub: 'Jezik, tema...' },
    { id: 'help', icon: HelpCircle, label: 'Pomoć i podrška', sub: 'Često postavljana pitanja' },
  ];

  // --- Sub-Screens ---

  const Header = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-6 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10 py-2 transition-colors duration-300">
      <button
        onClick={() => setCurrentView('main')}
        className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
    </div>
  );

  const PersonalDataView = () => (
    <div className="px-6 py-6 animate-slide-up">
      <Header title="Lični podaci" />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm space-y-4 transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-50 dark:border-orange-900/30"
            />
            <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full shadow-md">
              <Settings size={14} />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Ime i prezime</label>
          <Input defaultValue="Marko Marković" icon={User} className="dark:text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Email adresa</label>
          <Input defaultValue="marko.m@example.com" type="email" icon={MessageCircle} className="dark:text-white" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">Broj telefona</label>
          <Input defaultValue="+387 61 123 456" type="tel" icon={CardIcon} className="dark:text-white" />
        </div>
        <div className="pt-4">
          <Button>
            <Save size={18} />
            Sačuvaj promjene
          </Button>
        </div>
      </div>
    </div>
  );

  const HistoryView = () => (
    <div className="px-6 py-6 animate-slide-up">
      <Header title="Historija rezervacija" />
      <div className="space-y-4">
        {[
          { name: "Ćevabdžinica Željo", date: "12. Feb 2024", time: "14:00", people: 4, status: "Završeno", rating: 5 },
          { name: "Metropolis", date: "05. Feb 2024", time: "10:30", people: 2, status: "Završeno", rating: 4 },
          { name: "4 Sobe Gospođe Safije", date: "20. Jan 2024", time: "20:00", people: 2, status: "Otkazano", rating: null },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex flex-col gap-3 transition-colors duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">{item.date} u {item.time}</p>
              </div>
              <Badge className={item.status === 'Završeno' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}>
                {item.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3 text-sm text-gray-600 dark:text-gray-300">
              <span>{item.people} osobe</span>
              {item.rating && (
                <div className="flex text-orange-400">
                  {[...Array(item.rating)].map((_, j) => <div key={j}>★</div>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentView = () => (
    <div className="px-6 py-6 animate-slide-up">
      <Header title="Plaćanje" />

      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-3xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-10 -mb-10"></div>

        <div className="flex justify-between items-start mb-8">
          <span className="text-gray-400 text-sm">Trenutno stanje</span>
          <span className="font-bold text-lg italic">VISA</span>
        </div>
        <div className="mb-6">
          <h3 className="text-3xl font-bold">58.50 KM</h3>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-400 mb-1">Vlasnik kartice</p>
            <p className="font-medium tracking-wide">MARKO MARKOVIC</p>
          </div>
          <p className="font-mono">**** 4582</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 dark:text-white mb-4">Sačuvane kartice</h3>
      <div className="space-y-3">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">Visa Platinum</p>
              <p className="text-xs text-gray-400">**** 4582</p>
            </div>
          </div>
          <input type="radio" checked className="accent-orange-500 w-5 h-5" readOnly />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-100">Mastercard</p>
              <p className="text-xs text-gray-400">**** 9921</p>
            </div>
          </div>
          <input type="radio" className="accent-orange-500 w-5 h-5" />
        </div>
      </div>

      <Button variant="outline" className="mt-6 border-dashed border-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500">
        + Dodaj novu karticu
      </Button>
    </div>
  );

  const NotificationsView = () => (
    <div className="px-6 py-6 animate-slide-up">
      <Header title="Obavijesti" />
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm overflow-hidden transition-colors duration-300">
        {[
          { label: "Push notifikacije", desc: "Primaj obavijesti na telefon", checked: true },
          { label: "Email novosti", desc: "Sedmični pregled ponuda", checked: false },
          { label: "Podsjetnik rezervacije", desc: "1 sat prije termina", checked: true },
          { label: "Promocije i popusti", desc: "Specijalne ponude restorana", checked: true },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white">{item.label}</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500">{item.desc}</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.checked ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="px-6 py-6 animate-slide-up">
      <Header title="Postavke" />

      <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm p-2 space-y-2 transition-colors duration-300">
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"><Globe size={18} /></div>
            <span className="font-medium text-gray-800 dark:text-white">Jezik aplikacije</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            Bosanski <ChevronRight size={16} />
          </div>
        </button>

        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            <span className="font-medium text-gray-800 dark:text-white">
              {theme === 'dark' ? 'Svijetla tema' : 'Tamna tema'}
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            {theme === 'dark' ? 'Uključeno' : 'Isključeno'}
          </div>
        </button>

        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"><Shield size={18} /></div>
            <span className="font-medium text-gray-800 dark:text-white">Privatnost i sigurnost</span>
          </div>
          <ChevronRight size={16} className="text-gray-300 dark:text-gray-500" />
        </button>
      </div>

      <div className="mt-8">
        <h4 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold ml-4 mb-2">Ostalo</h4>
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm p-2 transition-colors duration-300">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl text-red-500 transition-colors">
            <span className="font-medium">Obriši račun</span>
          </button>
        </div>
      </div>
    </div>
  );

  const HelpView = () => (
    <div className="px-6 py-6 animate-slide-up">
      <Header title="Pomoć i podrška" />

      <div className="bg-orange-500 rounded-[2rem] p-6 text-white shadow-lg shadow-orange-200 dark:shadow-none mb-8 text-center">
        <HelpCircle size={48} className="mx-auto mb-4 opacity-80" />
        <h3 className="text-xl font-bold mb-2">Kako vam možemo pomoći?</h3>
        <p className="text-orange-100 text-sm mb-6">Naš tim je dostupan 24/7 za sva vaša pitanja i nedoumice.</p>
        <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform">
          Kontaktirajte podršku
        </button>
      </div>

      <h3 className="font-bold text-gray-800 dark:text-white mb-4">Često postavljana pitanja</h3>
      <div className="space-y-3">
        {[
          "Kako otkazati rezervaciju?",
          "Da li mogu platiti gotovinom?",
          "Kako promijeniti termin?",
          "Gdje vidim svoje bodove?"
        ].map((q, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">{q}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );

  // --- Main Render ---

  if (currentView === 'personal') return <PersonalDataView />;
  if (currentView === 'history') return <HistoryView />;
  if (currentView === 'payment') return <PaymentView />;
  if (currentView === 'notifications') return <NotificationsView />;
  if (currentView === 'settings') return <SettingsView />;
  if (currentView === 'help') return <HelpView />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pb-24 animate-fade-in transition-colors duration-300">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-b-[2.5rem] p-8 shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-1 mb-4 shadow-lg shadow-orange-200 dark:shadow-none">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80"
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Marko Marković</h2>
          <p className="text-gray-400 text-sm mb-6">marko.m@example.com</p>

          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
              <span className="block text-xl font-bold text-orange-600 dark:text-orange-400">12</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rezervacija</span>
            </div>
            <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
              <span className="block text-xl font-bold text-orange-600 dark:text-orange-400">4</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Recenzija</span>
            </div>
            <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
              <span className="block text-xl font-bold text-orange-600 dark:text-orange-400">580</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Bodova</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-6 py-6 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as SubView)}
            className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all group hover:shadow-md border border-transparent dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">{item.sub}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-orange-300 transition-colors" />
          </button>
        ))}

        <div className="pt-4">
          <Button
            variant="outline"
            className="text-red-500 border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/20"
            onClick={onLogout}
          >
            <LogOut size={18} />
            Odjavi se
          </Button>
          <p className="text-center text-gray-300 dark:text-gray-600 text-xs mt-4">Locato v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;