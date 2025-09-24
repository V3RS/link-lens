import { MoonIcon, SunIcon } from 'lucide-react';
interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}
const ThemeToggle = ({
  theme,
  onToggle
}: ThemeToggleProps) => {
  return <button onClick={onToggle} className="p-2 rounded-full button-bg transition-colors" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      {theme === 'dark' ? <SunIcon size={20} className="text-theme" /> : <MoonIcon size={20} className="text-theme" />}
    </button>;
};
export default ThemeToggle;