import { h } from './utils.js';
export function TrustBar() { return h('section', { className: 'trustbar' }, h('div', { className: 'container trust-grid' }, ['Premium Herbal Ingredients','GMP Quality Standards','Cash On Delivery','Secure Ordering','Made In India','Trusted Manufacturing'].map((item) => h('div', { className: 'trust-item', key: item }, `✔ ${item}`)))); }
