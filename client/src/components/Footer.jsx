import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
export default function Footer() {
    const { language } = useLanguage();
    const fr = language === 'fr';
    return <footer className="mt-24 bg-plum py-14 text-cream"><div className="container-luxury grid gap-10 sm:grid-cols-3"><div><p className="font-display text-3xl">Ze9zou9 <span className="text-gold">Parfum</span></p><p className="mt-3 max-w-xs text-sm text-cream/60">{fr ? 'Un parfum pour les moments qui deviennent une partie de votre identité.' : 'A fragrance for the moments that become part of your identity.'}</p></div><div><p className="eyebrow text-gold">{fr ? 'Explorer' : 'Explore'}</p><div className="mt-4 grid gap-2 text-sm text-cream/70"><Link to="/perfumes">{fr ? 'Tous les parfums' : 'All perfumes'}</Link><Link to="/perfumes?gender=Men">{fr ? 'Hommes' : 'Men'}</Link><Link to="/perfumes?gender=Women">{fr ? 'Femmes' : 'Women'}</Link><Link to="/about">{fr ? 'Notre histoire' : 'Our story'}</Link></div></div><div><p className="eyebrow text-gold">Contact</p>
        <p className="mt-4 text-sm text-cream/70">+213 555 00 00 00<br />hello@ze9zou9parfum.com<br />{fr ? 'Algérie' : 'Algeria'}</p></div></div><div className="container-luxury mt-12 border-t border-cream/10 pt-5 text-xs text-cream/40">© 2026 Ze9zou9 Parfum. {fr ? 'Tous droits réservés.' : 'All rights reserved.'}</div></footer>;
}
