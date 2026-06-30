import React, { useMemo, useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { TrustBar } from './components/TrustBar.jsx';
import { Products } from './components/Products.jsx';
import { Pricing } from './components/Pricing.jsx';
import { Ingredients } from './components/Ingredients.jsx';
import { Benefits } from './components/Benefits.jsx';
import { About } from './components/About.jsx';
import { Gallery } from './components/Gallery.jsx';
import { Testimonials } from './components/Testimonials.jsx';
import { ComboOffer } from './components/ComboOffer.jsx';
import { FAQ } from './components/FAQ.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';

const h = React.createElement;
const whatsappUrl = 'https://wa.me/919773812515';

function App() {
  const [cart, setCart] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);
  const addToCart = (item) => setCart((items) => [...items, item]);
  const buyNow = (item) => {
    addToCart(item);
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };
  const clearCart = () => setCart([]);

  return h(React.Fragment, null,
    h(Navbar, { cartCount: cart.length }),
    h('main', null,
      h(Hero, { buyNow }),
      h(TrustBar),
      h(Products, { addToCart, buyNow }),
      h(Pricing, { buyNow }),
      h(Benefits),
      h(Ingredients),
      h(About),
      h(Gallery, { lightbox, setLightbox }),
      h(Testimonials),
      h(ComboOffer, { buyNow }),
      h(FAQ),
      h(Contact),
      h('section', { id: 'checkout', className: 'section checkout' },
        h('div', { className: 'container checkout-grid' },
          h('div', null,
            h('p', { className: 'eyebrow' }, 'Secure checkout'),
            h('h2', null, 'Order Summary'),
            h('p', { className: 'muted' }, 'Review your selection and complete your order using Cash on Delivery or WhatsApp expert support.')
          ),
          h('div', { className: 'checkout-card glass' },
            cart.length ? cart.map((item, index) => h('div', { className: 'summary-row', key: `${item.name}-${index}` }, h('span', null, item.name), h('strong', null, `₹${item.price}`))) : h('p', { className: 'muted' }, 'Your cart is ready. Add a wellness pack to begin.'),
            h('div', { className: 'summary-total' }, h('span', null, 'Total'), h('strong', null, `₹${total}`)),
            h('label', { className: 'cod-option' }, h('input', { type: 'radio', defaultChecked: true, name: 'payment' }), ' Cash On Delivery available'),
            h('div', { className: 'trust-mini' }, 'Secure ordering • Fast shipping • Free consultation'),
            h('div', { className: 'button-row' }, h('a', { className: 'btn btn-primary', href: whatsappUrl, target: '_blank', rel: 'noreferrer' }, 'Place Order on WhatsApp'), h('button', { className: 'btn btn-ghost', onClick: clearCart }, 'Clear Cart'))
          )
        )
      )
    ),
    h(Footer),
    h('a', { className: 'floating-whatsapp', href: whatsappUrl, target: '_blank', rel: 'noreferrer', 'aria-label': 'Chat with Sukoon Veda on WhatsApp' }, 'WhatsApp'),
    h('div', { className: 'mobile-bar' }, h('a', { href: '#products' }, 'Buy Now'), h('a', { href: whatsappUrl, target: '_blank', rel: 'noreferrer' }, 'WhatsApp Expert'), h('a', { href: '#checkout' }, `Cart ${cart.length}`))
  );
}

export default App;
