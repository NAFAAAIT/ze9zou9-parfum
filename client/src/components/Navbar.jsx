import { Link } from 'react-router-dom';
import { Moon, ShoppingBag, Sun } from 'lucide-react';
import { useCart } from '../context/CartContext'; import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { count } = useCart();
  const { dark, toggle } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const fr = language === 'fr';
  return (
    <header className="sticky top-0 z-50 border-b border-plum/10 bg-cream/95 backdrop-blur-sm dark:border-cream/10 dark:bg-[#1b0c1a]/95">
      <nav className="container-luxury flex h-20 items-center justify-between">
        <Link to="/" className="font-display text-3xl font-semibold tracking-tight">Ze9zou9 <span className="text-copper">Parfum</span></Link>
        <div className="hidden items-center gap-8 text-xs uppercase tracking-[.18em] md:flex">
          <Link to="/" className="transition hover:text-copper">{fr ? 'Accueil' : 'Home'}</Link>
          <Link to="/perfumes" className="transition hover:text-copper">{fr ? 'Parfums' : 'Perfumes'}</Link>
          <Link to="/perfumes?gender=Men" className="transition hover:text-copper">{fr ? 'Hommes' : 'Men'}</Link>
          <Link to="/perfumes?gender=Women" className="transition hover:text-copper">{fr ? 'Femmes' : 'Women'}</Link>
          <Link to="/about" className="transition hover:text-copper">{fr ? 'À propos' : 'About'}</Link>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Changer de langue" onClick={toggleLanguage} className="border border-plum/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest transition hover:border-copper hover:text-copper dark:border-cream/15">
            {fr ? 'FR' : 'EN'}
          </button>
          <button aria-label={fr ? 'Changer de thème' : 'Change theme'} onClick={toggle} className="transition hover:text-copper">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <Link aria-label={fr ? 'Panier' : 'Cart'} to="/cart" className="relative transition hover:text-copper"><ShoppingBag size={20}/>{count > 0 && <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-copper text-[10px] text-white">{count}</span>}</Link>
        </div>
      </nav>
    </header>
  );
}
