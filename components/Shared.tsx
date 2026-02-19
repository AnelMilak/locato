import React from 'react';
import { LucideProps } from 'lucide-react';

export const Input = ({ icon: Icon, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.FC<LucideProps> }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {Icon && (
        <div className="absolute left-4 text-orange-300">
          <Icon size={20} />
        </div>
      )}
      <input
        className={`w-full bg-orange-50 border-none rounded-2xl py-4 ${Icon ? 'pl-12' : 'pl-4'} pr-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 outline-none transition-all shadow-sm`}
        {...props}
      />
    </div>
  );
};

export const Button = ({ children, variant = 'primary', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }) => {
  const baseStyle = "w-full py-4 rounded-2xl font-semibold transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-orange-200",
    secondary: "bg-emerald-500 text-white shadow-emerald-200",
    outline: "bg-white text-gray-700 border border-gray-200 shadow-sm"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);