import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Pencil, Plus, Trash2, X } from 'lucide-react';

export function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState('');
  const submit = async (e) => { e.preventDefault(); try { const { data } = await api.post('/admin/login', form); sessionStorage.setItem('zp-admin-token', data.token); window.location.href = '/admin'; } catch (err) { setError(err.response?.data?.message || 'Unable to sign in.'); } };
  return <main className="container-luxury max-w-lg py-24"><p className="eyebrow">Private access</p><h1 className="mt-2 font-display text-6xl">Admin login</h1><form onSubmit={submit} className="mt-10 grid gap-5"><input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-b bg-transparent py-3 outline-none"/><input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border-b bg-transparent py-3 outline-none"/>{error && <p className="text-sm text-red-700">{error}</p>}<button className="btn-primary">Sign in</button></form></main>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard');
  useEffect(() => { api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${sessionStorage.getItem('zp-admin-token')}` } }).then((r) => setStats(r.data)).catch((e) => setError(e.response?.data?.message || 'Session expired.')); }, []);
  if (error) return <main className="container-luxury py-24 text-center"><p>{error}</p><a href="/admin/login" className="btn-primary mt-6">Sign in again</a></main>;
  if (!stats) return <main className="container-luxury py-24">Loading dashboard...</main>;
  return <main className="container-luxury py-16"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">At a glance</p><h1 className="mt-2 font-display text-6xl">Dashboard</h1></div><div className="flex gap-2"><button onClick={() => setTab('dashboard')} className={`border px-4 py-2 text-xs uppercase tracking-widest ${tab === 'dashboard' ? 'border-copper text-copper' : ''}`}>Overview</button><button onClick={() => setTab('products')} className={`border px-4 py-2 text-xs uppercase tracking-widest ${tab === 'products' ? 'border-copper text-copper' : ''}`}>Products</button></div></div>{tab === 'dashboard' ? <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[['Products', stats.totalProducts], ['Orders', stats.totalOrders], ['Pending', stats.pending], ['Delivered', stats.delivered], ['Cancelled', stats.cancelled], ['Revenue', `${stats.revenue.toLocaleString()} DA`]].map(([label, value]) => <div key={label} className="bg-[#eee8df] p-7 dark:bg-[#291428]"><p className="eyebrow">{label}</p><p className="mt-3 font-display text-4xl">{value}</p></div>)}</div> : <AdminProducts onProductsChange={() => api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${sessionStorage.getItem('zp-admin-token')}` } }).then((r) => setStats(r.data))}/>}</main>;
}

const emptyProduct = {
  name: '', brand: 'Ze9zou9 Parfum', description: '', gender: 'Unisex',
  price: '', sizes: ['15ml', '100ml'], stock: 0, category: 'Eau de Parfum',
  topNotes: '', heartNotes: '', baseNotes: '', images: '', discount: 0,
  isFeatured: false, isNew: false
};

function AdminProducts({ onProductsChange }) {
  const [products, setProducts] = useState([]); const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); const [form, setForm] = useState(emptyProduct);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [uploading, setUploading] = useState(false);
  const auth = { headers: { Authorization: `Bearer ${sessionStorage.getItem('zp-admin-token')}` } };
  const load = () => api.get('/products?limit=48').then((r) => setProducts(r.data.products)).catch(() => setNotice('Unable to load products.'));
  useEffect(() => { load(); }, []);
  const openCreate = () => { setEditing(null); setForm(emptyProduct); setFormOpen(true); };
  const openEdit = (product) => {
    setFormOpen(true);
    setEditing(product._id);
    setForm({
      name: product.name, brand: product.brand, description: product.description, gender: product.gender,
      price: product.price, sizes: product.sizes || [], stock: product.stock,
      category: product.category || 'Eau de Parfum',
      topNotes: product.notes?.topNotes?.join(', ') || '', heartNotes: product.notes?.heartNotes?.join(', ') || '',
      baseNotes: product.notes?.baseNotes?.join(', ') || '', images: product.images?.join(', ') || '',
      discount: product.discount || 0, isFeatured: product.isFeatured, isNew: product.isNew
    });
  };
  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setNotice('The image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }
    const upload = new FormData();
    upload.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/products/upload', upload, {
        ...auth,
        headers: { ...auth.headers, 'Content-Type': 'multipart/form-data' }
      });
      setForm((current) => ({ ...current, images: data.path }));
      setNotice('Image uploaded.');
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to upload image.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };
  const save = async (event) => {
    event.preventDefault();
    const payload = {
      name: form.name.trim(), brand: form.brand.trim(), description: form.description.trim(), gender: form.gender,
      price: Number(form.price), sizes: form.sizes, stock: Number(form.stock), category: form.category,
      notes: { topNotes: form.topNotes.split(',').map((x) => x.trim()).filter(Boolean), heartNotes: form.heartNotes.split(',').map((x) => x.trim()).filter(Boolean), baseNotes: form.baseNotes.split(',').map((x) => x.trim()).filter(Boolean) },
      images: form.images.split(',').map((x) => x.trim()).filter(Boolean),
      discount: Number(form.discount), isFeatured: form.isFeatured, isNew: form.isNew
    };
    try {
      if (!payload.images.length) throw new Error('At least one image path is required.');
      if (editing) await api.put(`/products/${editing}`, payload, auth);
      else await api.post('/products', payload, auth);
      setNotice(editing ? 'Product updated.' : 'Product created.');
      setEditing(null); setForm(emptyProduct); setFormOpen(false); load(); onProductsChange();
    } catch (err) { setNotice(err.response?.data?.message || err.message || 'Unable to save product.'); }
  };
  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try { await api.delete(`/products/${product._id}`, auth); setNotice('Product deleted.'); load(); onProductsChange(); }
    catch (err) { setNotice(err.response?.data?.message || 'Unable to delete product.'); }
  };
  const filtered = products.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(search.toLowerCase()));
  const fieldClass = 'mt-2 w-full border-b bg-transparent py-3 text-sm outline-none';
  return <section className="mt-12"><div className="flex flex-wrap items-center justify-between gap-4"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full max-w-sm border-b bg-transparent py-3 outline-none"/><button onClick={openCreate} className="btn-primary"><Plus size={16} className="mr-2"/>Add perfume</button></div>{notice && <p className="mt-5 text-sm text-copper">{notice}</p>} {formOpen && <form onSubmit={save} className="mt-8 grid gap-5 bg-[#eee8df] p-6 dark:bg-[#291428] sm:grid-cols-2"><div className="flex items-center justify-between sm:col-span-2"><p className="eyebrow">{editing ? 'Edit perfume' : 'New perfume'}</p><button type="button" onClick={() => { setEditing(null); setForm(emptyProduct); setFormOpen(false); }}><X size={18}/></button></div><label>Name<input required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} className={fieldClass}/></label><label>Brand<input required value={form.brand} onChange={(e) => setForm({...form,brand:e.target.value})} className={fieldClass}/></label><label className="sm:col-span-2">Description<textarea required rows="3" value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} className={fieldClass}/></label><label>Gender<select value={form.gender} onChange={(e) => setForm({...form,gender:e.target.value})} className={fieldClass}><option>Men</option><option>Women</option><option>Unisex</option></select></label><label>Price (DA)<input required type="number" min="0" value={form.price} onChange={(e) => setForm({...form,price:e.target.value})} className={fieldClass}/></label><label>Stock<input required type="number" min="0" value={form.stock} onChange={(e) => setForm({...form,stock:e.target.value})} className={fieldClass}/></label><label>Discount %<input type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({...form,discount:e.target.value})} className={fieldClass}/></label><label>Category<input value={form.category} onChange={(e) => setForm({...form,category:e.target.value})} className={fieldClass}/></label><label>Sizes<div className="mt-3 flex gap-5">{['15ml','100ml'].map((size) => <label key={size} className="flex items-center gap-2"><input type="checkbox" checked={form.sizes.includes(size)} onChange={(e) => setForm({...form,sizes:e.target.checked ? [...form.sizes,size] : form.sizes.filter((x) => x !== size)})}/>{size}</label>)}</div></label><label>Top notes<input value={form.topNotes} onChange={(e) => setForm({...form,topNotes:e.target.value})} placeholder="Bergamot, Saffron" className={fieldClass}/></label><label>Heart notes<input value={form.heartNotes} onChange={(e) => setForm({...form,heartNotes:e.target.value})} placeholder="Jasmine, Rose" className={fieldClass}/></label><label>Base notes<input value={form.baseNotes} onChange={(e) => setForm({...form,baseNotes:e.target.value})} placeholder="Oud, Musk" className={fieldClass}/></label>  <label className="sm:col-span-2">Product image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className={fieldClass}/>{uploading && <span className="mt-2 block text-xs text-copper">Uploading image...</span>}{form.images && <div className="mt-3 overflow-hidden rounded-sm border border-plum/10"><img src={form.images.split(',')[0]} alt="Selected perfume preview" className="h-52 w-full object-cover"/></div>}{form.images && <span className="mt-2 block break-all text-xs opacity-60">{form.images}</span>}</label><div className="flex gap-6 sm:col-span-2"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({...form,isFeatured:e.target.checked})}/>Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({...form,isNew:e.target.checked})}/>New arrival</label></div><button className="btn-primary sm:col-span-2" disabled={uploading}>{editing ? 'Save changes' : 'Create perfume'}</button></form>}<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <article key={product._id} className="border border-plum/10 p-4 dark:border-cream/10"><img src={product.images?.[0]} alt={product.name} className="aspect-[4/3] w-full object-cover"/><div className="mt-4 flex items-start justify-between gap-3"><div><p className="font-display text-2xl">{product.name}</p><p className="mt-1 text-xs uppercase tracking-widest text-copper">{product.gender} · Stock {product.stock}</p></div><div className="flex gap-2"><button aria-label={`Edit ${product.name}`} onClick={() => openEdit(product)} className="hover:text-copper"><Pencil size={16}/></button><button aria-label={`Delete ${product.name}`} onClick={() => remove(product)} className="hover:text-copper"><Trash2 size={16}/></button></div></div></article>)}</div>{!filtered.length && <p className="py-16 text-center font-display text-3xl">No products found.</p>}</section>;
}
