import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
const names = ['Noir Sillage', 'Fleur d’Aube', 'Ambre Atlas', 'Velours Oud', 'Cèdre Blanc', 'Éclat Solaire', 'Musc Secret', 'Rose Majesté', 'Bois d’Azur', 'Iris Minuit', 'Néroli Rare', 'Épice Royale'];
const genders = ['Unisex', 'Women', 'Unisex', 'Men', 'Men', 'Women', 'Unisex', 'Women', 'Men', 'Women', 'Unisex', 'Men'];
const imageIds = ['noir-sillage', 'fleur-daube', 'ambre-atlas', 'velours-oud', 'cedre-blanc', 'eclat-solaire', 'musc-secret', 'rose-majeste', 'bois-dazur', 'iris-minuit', 'neroli-rare', 'epice-royale'];
const products = names.map((name, i) => ({ name, brand: 'Ze9zou9 Parfum', description: 'A refined Eau de Parfum composed for unforgettable evenings and quiet confidence.', gender: genders[i], price: 8500 + i * 650, sizes: ['15ml', '100ml'], notes: { topNotes: ['Bergamot', 'Saffron'], heartNotes: ['Jasmine', 'Rose'], baseNotes: ['Oud', 'Musk', 'Amber'] }, images: [`/images/products/${imageIds[i]}.jpg`], stock: 5 + i, isFeatured: i < 4, isNew: i > 7, discount: i % 4 === 0 ? 10 : 0 }));
await mongoose.connect(process.env.MONGO_URI); await Product.deleteMany({}); await Product.insertMany(products); console.log(`Seeded ${products.length} products.`); await mongoose.disconnect();
