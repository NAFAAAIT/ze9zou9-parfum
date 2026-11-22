import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export function About() { return <main className="container-luxury py-24 text-center"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">Notre histoire</motion.p><motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto mt-3 max-w-3xl font-display text-7xl">Une expression discrète de <i>soi.</i></motion.h1><p className="mx-auto mt-8 max-w-xl leading-8 text-plum/60 dark:text-cream/60">Ze9zou9 Parfum est une maison algérienne dédiée au rituel du parfum. Nous sélectionnons des matières expressives pour créer des Eau de Parfum modernes, profondes et chaleureuses.</p></main>; }
export function Contact() { return <main className="container-luxury py-24"><p className="eyebrow">Nous contacter</p><h1 className="mt-3 font-display text-7xl">Nous serions ravis de vous lire.</h1><div className="mt-14 grid gap-8 sm:grid-cols-3"><div><p className="eyebrow">Téléphone</p><p className="mt-3">+213 555 00 00 00</p></div><div><p className="eyebrow">Email</p><p className="mt-3">hello@ze9zou9parfum.com</p></div><div><p className="eyebrow">Instagram</p><p className="mt-3">@ze9zou9parfum</p></div></div></main>; }
export function Confirmation() { const { id } = useParams(); return <main className="container-luxury py-28 text-center"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">Merci</motion.p><motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-display text-7xl">Commande confirmée.</motion.h1><p className="mx-auto mt-5 max-w-md text-sm leading-7 opacity-70">Votre commande {id} sera préparée avec soin et livrée prochainement. Paiement à la livraison.</p><Link to="/perfumes" className="btn-primary mt-8">Continuer à explorer</Link></main>; }
export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const { add } = useCart();
  useEffect(() => { api.get(`/products/${id}`).then((response) => { setProduct(response.data); setSize(response.data.sizes[0]); }); }, [id]);
  if (!product) return <main className="container-luxury py-24">Chargement...</main>;
  const gender = { Men: 'Hommes', Women: 'Femmes', Unisex: 'Mixte' }[product.gender] || product.gender;
  return (
    <main className="container-luxury py-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }} className="grid gap-12 md:grid-cols-2">
        <motion.img initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} src={product.images[0]} alt={product.name} className="w-full max-w-lg object-cover" />
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <p className="eyebrow">{product.brand} · {gender}</p><h1 className="mt-3 font-display text-6xl">{product.name}</h1><p className="mt-5 text-2xl">{Math.round(product.price * (1 - product.discount / 100)).toLocaleString()} DA</p><p className="mt-8 max-w-lg leading-7 opacity-70">{product.description}</p>
          <div className="mt-10"><p className="eyebrow">Format</p><div className="mt-3 flex gap-2">{product.sizes.map((itemSize) => <motion.button whileHover={{ y: -2 }} key={itemSize} onClick={() => setSize(itemSize)} className={`border px-5 py-3 text-sm ${itemSize === size ? 'border-copper text-copper' : ''}`}>{itemSize}</motion.button>)}</div></div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => add(product, size)} className="btn-primary mt-8">Ajouter au panier</motion.button>
          <div className="mt-12 grid grid-cols-3 gap-3 border-t pt-6 text-sm"><div><p className="eyebrow">Tête</p><p className="mt-2">{product.notes.topNotes.join(', ')}</p></div><div><p className="eyebrow">Cœur</p><p className="mt-2">{product.notes.heartNotes.join(', ')}</p></div><div><p className="eyebrow">Fond</p><p className="mt-2">{product.notes.baseNotes.join(', ')}</p></div></div>
        </motion.div>
      </motion.div>
    </main>
  );
}
