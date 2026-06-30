import productImage from '../assets/product.png';
import { h } from './utils.jsx';
const products = [
 { name:'Sukoon Pro Power Capsules', details:'60 Capsules • 500mg Each', price:1499, description:'Traditional herbal wellness formulation designed to support vitality and overall wellbeing.'},
 { name:'Sukoon Pro Power Oil', details:'15ml', price:799, description:'Premium herbal wellness oil crafted using traditional ingredients.'},
 { name:'Performance Combo', details:'Capsules + Oil', price:2299, badge:'Best Value', description:'A complete daily wellness bundle for customers who prefer a premium combined routine.'}
];
export function Products({ addToCart, buyNow }) { return h('section', { id:'products', className:'section' }, h('div', { className:'container' }, h('p', { className:'eyebrow center' }, 'Featured Products'), h('h2', { className:'section-title' }, 'Premium Wellness Essentials'), h('div', { className:'product-grid' }, products.map((p) => h('article', { className:'product-card glass', key:p.name }, p.badge && h('span', { className:'badge' }, p.badge), h('img', { src: productImage, alt:`${p.name} packshot`, loading:'lazy' }), h('h3', null, p.name), h('p', { className:'details' }, p.details), h('p', { className:'muted' }, p.description), h('strong', { className:'price' }, `₹${p.price}`), h('div', { className:'button-row' }, h('button', { className:'btn btn-primary', onClick:()=>buyNow(p) }, 'Buy Now'), h('button', { className:'btn btn-ghost', onClick:()=>addToCart(p) }, 'Add To Cart'))))))); }
