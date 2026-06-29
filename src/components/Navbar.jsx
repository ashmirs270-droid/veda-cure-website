import { h, whatsappUrl } from './utils.jsx';
const links = ['Home', 'Products', 'Ingredients', 'About Us', 'Reviews', 'FAQ', 'Contact'];
export function Navbar({ cartCount }) {
  const idFor = (label) => label === 'Home' ? 'home' : label.toLowerCase().replace(' us', '').replaceAll(' ', '-');
  return h('header', { className: 'navbar' }, h('div', { className: 'container nav-wrap' },
    h('a', { className: 'logo', href: '#home', 'aria-label': 'Sukoon Veda home' }, h('span', { className: 'leaf' }, '☘'), h('span', null, 'SUKOON VEDA')),
    h('nav', { 'aria-label': 'Primary navigation' }, links.map((link) => h('a', { key: link, href: `#${idFor(link)}` }, link))),
    h('div', { className: 'nav-actions' }, h('a', { href: '#checkout', className: 'cart', 'aria-label': 'Open cart' }, `🛒 ${cartCount}`), h('a', { className: 'btn btn-small', href: whatsappUrl, target: '_blank', rel: 'noreferrer' }, 'WhatsApp'))
  ));
}
