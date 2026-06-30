import { h, whatsappUrl, productImage } from './utils.jsx';
export function Hero({ buyNow }) {
  return h('section', { id: 'home', className: 'hero section' }, h('div', { className: 'container hero-grid' },
    h('div', { className: 'hero-copy fade-up' }, h('p', { className: 'eyebrow' }, 'Traditional Wellness. Modern Confidence.'), h('h1', null, 'Experience the Power of Traditional Wellness'), h('p', { className: 'hero-sub' }, 'Premium herbal formulations inspired by traditional Ayurvedic and Unani wisdom, crafted to support vitality, stamina, confidence, and overall wellbeing.'), h('div', { className: 'button-row' }, h('button', { className: 'btn btn-primary', onClick: () => buyNow({ name: 'Sukoon Pro Power Capsules', price: 1499 }) }, 'Shop Now'), h('a', { className: 'btn btn-outline', href: whatsappUrl, target: '_blank', rel: 'noreferrer' }, 'Talk To Expert'), h('a', { className: 'btn btn-whatsapp', href: whatsappUrl, target: '_blank', rel: 'noreferrer' }, 'WhatsApp'))),
    h('div', { className: 'hero-products', 'aria-label': 'Sukoon Veda premium product display' }, h('span', { className: 'herb herb-1' }, 'Ashwagandha'), h('span', { className: 'herb herb-2' }, 'Shilajit'), h('div', { className: 'glow' }), h('img', { src: productImage, alt: 'Sukoon Pro Power Capsules and Oil premium product packaging', loading: 'eager' }), h('div', { className: 'product-plinth' }))
  ));
}
