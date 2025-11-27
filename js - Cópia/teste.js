// ===== dados de exemplo (troque/adicione produtos) =====
const products = [
  { id: 1, name: "Run Free 2", brand: "Adidas", price: 399.90, img: "img/adidas-shoe.jpg", desc: "Tênis de corrida leve e responsivo." },
  { id: 2, name: "Everyday Tee", brand: "Nike",  price: 89.90,  img: "img/nike-shirt.jpg", desc: "Camiseta respirável para uso diário." },
  { id: 3, name: "Classic Backpack", brand: "Puma", price: 129.90, img: "img/puma-backpack.jpg", desc: "Mochila resistente para rotina urbana." },
  { id: 4, name: "Sprint Shoes", brand: "Nike", price: 459.90, img: "img/nike-shoe2.jpg", desc: "Desempenho para velocidade." },
  { id: 5, name: "Training Shorts", brand: "Adidas", price: 79.90, img: "img/adidas-shorts.jpg", desc: "Shorts leves para treino." },
  { id: 6, name: "Street Runner", brand: "Puma", price: 299.90, img: "img/puma-shoe2.jpg", desc: "Casual com pegada urbana." }
];

// ===== utilitários =====
const shopEl = document.getElementById('shop');
const filterButtons = document.querySelectorAll('.chip');
const searchInput = document.getElementById('search');

// Formata valor em BRL
function formatBRL(value){
  return value.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

// Renderiza lista de produtos
function renderProducts(list){
  shopEl.innerHTML = '';
  if(list.length === 0){
    shopEl.innerHTML = <div style="grid-column:1/-1; text-align:center; color:#888; padding:36px">Nenhum produto encontrado.</div>;
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="media"><img src="${p.img}" alt="${p.name}"></div>
      <h3>${p.name}</h3>
      <div class="brand-tag">${p.brand}</div>
      <div class="price">${formatBRL(p.price)}</div>
      <div class="actions">
        <button class="btn" data-id="${p.id}" data-action="view">Ver</button>
        <button class="btn primary" data-id="${p.id}" data-action="buy">Comprar</button>
      </div>
    `;
    shopEl.appendChild(card);
  });
}

// filtro por marca
document.querySelector('.filters').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if(!btn) return;
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const brand = btn.dataset.brand;
  applyFilters({ brand });
});

// busca por nome
searchInput.addEventListener('input', () => {
  applyFilters({ q: searchInput.value.trim() });
});

// aplica filtros combinados
function applyFilters({ brand, q } = {}){
  const activeBtn = document.querySelector('.chip.active');
  const currentBrand = brand ?? (activeBtn ? activeBtn.dataset.brand : 'all');
  const query = (q ?? searchInput.value.trim()).toLowerCase();

  let list = products.slice();

  if(currentBrand && currentBrand !== 'all'){
    list = list.filter(p => p.brand === currentBrand);
  }
  if(query){
    list = list.filter(p => (p.name + ' ' + p.brand + ' ' + (p.desc||'')).toLowerCase().includes(query));
  }
  renderProducts(list);
}

// modal
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalBrand = document.getElementById('modalBrand');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const addToCartBtn = document.getElementById('addToCart');

shopEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if(!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  const product = products.find(p => p.id === id);
  if(!product) return;

  if(action === 'view' || action === 'buy'){
    openModal(product);
    if(action === 'buy'){
      // Simples feedback visual; fluxo de carrinho pode ser implementado aqui
      addToCartBtn.focus();
    }
  }
});

function openModal(p){
  modalImage.src = p.img;
  modalImage.alt = p.name;
  modalName.textContent = p.name;
  modalBrand.textContent = p.brand;
  modalDesc.textContent = p.desc || '';
  modalPrice.textContent = formatBRL(p.price);
  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden','false');
}

// fechar modal
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => { if(e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

function closeModal(){
  modalBackdrop.style.display = 'none';
  modalBackdrop.setAttribute('aria-hidden','true');
}

// inicial
renderProducts(products);