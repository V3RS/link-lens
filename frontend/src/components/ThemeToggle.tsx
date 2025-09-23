import { MoonIcon, SunIcon } from 'lucide-react';
interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}
const ThemeToggle = ({
  theme,
  onToggle
}: ThemeToggleProps) => {
  return <button onClick={onToggle} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-[#1E2128] hover:bg-[#2A2D36]' : 'bg-[#F0F2F5] hover:bg-[#E5E7EB]'} transition-colors`} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      {theme === 'dark' ? <SunIcon size={20} className="text-[#EAECEF]" /> : <MoonIcon size={20} className="text-[#1A1D23]" />}
    </button>;
};
export default ThemeToggle;