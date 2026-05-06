import './style.css'
import { Spring2D } from './engine/Physics'

interface ItemData {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface DraggableItem {
  data: ItemData;
  spring: Spring2D;
  element: HTMLElement | null;
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
  homeX: number;
  homeY: number;
  isShopItem?: boolean;
}

interface GameState {
  gold: number;
  shopItems: DraggableItem[];
  inventory: DraggableItem[];
}

const shopData: ItemData[] = [
  { id: '1', name: 'Floppy Disk', price: 10, icon: '💾' },
  { id: '2', name: 'CD-ROM', price: 50, icon: '💿' },
  { id: '3', name: 'Sound Card', price: 120, icon: '🎵' },
  { id: '4', name: 'GPU-98', price: 200, icon: '🎮' },
  { id: '5', name: 'Modem', price: 80, icon: '📞' },
  { id: '6', name: 'ZIP Drive', price: 150, icon: '📼' },
  { id: '7', name: 'RAM Stick', price: 90, icon: '📟' },
];

const state: GameState = {
  gold: 256,
  shopItems: shopData.map(d => ({
    data: d,
    spring: new Spring2D(250, 20),
    element: null,
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    homeX: 0,
    homeY: 0,
    isShopItem: true
  })),
  inventory: []
};

function buyItem(id: string) {
  const shopItem = state.shopItems.find(i => i.data.id === id);
  if (shopItem && state.gold >= shopItem.data.price) {
    state.gold -= shopItem.data.price;
    
    const newItem: DraggableItem = {
      data: { ...shopItem.data },
      spring: new Spring2D(200, 15),
      element: null,
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      homeX: 0,
      homeY: 0
    };
    
    state.inventory.push(newItem);
    render();
  } else if (shopItem) {
    console.log("INSUFFICIENT CREDITS");
  }
}

function setupDraggable(item: DraggableItem) {
  const el = item.element;
  if (!el) return;

  el.addEventListener('pointerdown', (e) => {
    item.isDragging = true;
    el.setPointerCapture(e.pointerId);
    
    const rect = el.getBoundingClientRect();
    item.offsetX = e.clientX - rect.left;
    item.offsetY = e.clientY - rect.top;
    
    el.style.zIndex = '1000';
    el.style.filter = 'brightness(1.5) drop-shadow(0 5px 15px rgba(0,255,0,0.3))';
  });

  window.addEventListener('pointermove', (e) => {
    if (!item.isDragging || !item.element) return;
    item.spring.targetX = e.clientX - item.offsetX - item.homeX;
    item.spring.targetY = e.clientY - item.offsetY - item.homeY;
  });

  window.addEventListener('pointerup', (e) => {
    if (!item.isDragging || !item.element) return;
    item.isDragging = false;
    item.element.releasePointerCapture(e.pointerId);
    
    item.element.style.zIndex = '1';
    item.element.style.filter = 'none';

    if (item.isShopItem) {
      const invContainer = document.getElementById('inventory-container');
      if (invContainer) {
        const rect = invContainer.getBoundingClientRect();
        if (
          e.clientX > rect.left && 
          e.clientX < rect.right && 
          e.clientY > rect.top && 
          e.clientY < rect.bottom
        ) {
          buyItem(item.data.id);
        }
      }
    }

    item.spring.targetX = 0;
    item.spring.targetY = 0;
  });
}

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  
  app.innerHTML = `
    <div id="action-zone">
      <div class="scanline"></div>
      <div style="font-family: monospace; white-space: pre; font-size: 10px; color: #0f0; text-align: center;">
 ██░ ██  ▄▄▄       ▄████▄   ██ hardware ██ ▓█████  ██▀███  
▓██░ ██▒▒████▄    ▒██▀ ▀█  ██▄▄▄▄▄▄▄▄▄▄▄▄▄▄▓█   ▀ ▓██ ▒ ██▒
▒██▀▀██░▒██  ▀█▄  ▒▓█    ▄ ▓█   ▀ ▓█   ▀ ▓█  ▄▄▄ ▓██ ░▄█ ▒
░▓█ ░██ ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▓█   ▀ ▓█   ▀ ▓█  █  █▒██▀▀█▄  
░▓█▒░██▓ ▓█   ▓██▒▒ ▓███▀ ░▒█████▒▒█████▒░▒█████▒░██▓ ▒██▒
 ▒ ░░▒░▒ ▒▒   ▓▒█░░ ░▒ ▒  ░░ ▒░ ░░ ▒░ ░░░ ▒   ░░ ▒▓ ░▒▓░
 ▒ ░▒░ ░  ▒   ▒▒ ░  ░  ▒   ░ ░  ░ ░ ░  ░  ░   ░  ░▒ ░ ▒░
 ░  ░░ ░  ░   ▒   ░        ░   ░   ░   ░ ░    ░   ░░   ░ 
 ░  ░  ░      ░  ░░ ░      ░  ░    ░  ░       ░    ░     
                  ░                                    
      </div>
      <div style="margin-top: 10px; font-family: monospace; color: #0f0;">[DRAG_TO_BUY: ENABLED]</div>
      <button style="margin-top: 15px;">INITIATE_BATTLE.EXE</button>
    </div>

    <div id="interaction-zone">
      <div class="window shop-window">
        <div class="title-bar">
          <div class="title-bar-text">Hacker_Shop.exe</div>
          <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div class="window-body">
          <p>Hardware Shop (Drag to Buy):</p>
          <div class="item-row" id="shop-items-container">
            ${state.shopItems.map((item, index) => `
              <div class="item-slot shop-item" id="shop-${index}" style="touch-action: none; position: relative;">
                <div style="font-size: 24px; pointer-events: none;">${item.data.icon}</div>
                <div style="font-size: 8px; pointer-events: none;">${item.data.name}<br>$${item.data.price}</div>
              </div>
            `).join('')}
          </div>

          <p style="margin-top: 10px;">Your Inventory:</p>
          <div class="item-row" id="inventory-container" style="min-height: 100px; background: rgba(0,0,0,0.05); border: 2px dashed #808080;">
            ${state.inventory.length === 0 ? '<div style="font-size: 10px; padding: 10px; color: #888; pointer-events: none;">Drop Items Here</div>' : ''}
            ${state.inventory.map((item, index) => `
              <div class="item-slot inventory-item" id="inv-${index}" style="touch-action: none; position: relative;">
                <div style="font-size: 24px; pointer-events: none;">${item.data.icon}</div>
                <div style="font-size: 8px; pointer-events: none;">${item.data.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="status-bar">
          <p class="status-bar-field">Credits: $${state.gold}</p>
          <p class="status-bar-field">Items: ${state.inventory.length}</p>
          <p class="status-bar-field">CPU: 80486DX</p>
        </div>
      </div>
    </div>
  `;

  state.shopItems.forEach((item, index) => {
    const el = document.getElementById(`shop-${index}`);
    if (el) {
      item.element = el;
      const rect = el.getBoundingClientRect();
      item.homeX = rect.left;
      item.homeY = rect.top;
      setupDraggable(item);
    }
  });

  state.inventory.forEach((item, index) => {
    const el = document.getElementById(`inv-${index}`);
    if (el) {
      item.element = el;
      const rect = el.getBoundingClientRect();
      item.homeX = rect.left;
      item.homeY = rect.top;
      setupDraggable(item);
    }
  });
}

let lastTime = performance.now();

function animate(currentTime: number) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  state.shopItems.forEach(item => {
    if (item.element) {
      item.spring.update(dt);
      const tilt = item.spring.vx * 0.02;
      item.element.style.transform = `translate3d(${item.spring.x}px, ${item.spring.y}px, 0) rotate(${tilt}deg)`;
    }
  });

  state.inventory.forEach(item => {
    if (item.element) {
      item.spring.update(dt);
      const tilt = item.spring.vx * 0.02;
      item.element.style.transform = `translate3d(${item.spring.x}px, ${item.spring.y}px, 0) rotate(${tilt}deg)`;
    }
  });

  requestAnimationFrame(animate);
}

render();
requestAnimationFrame(animate);
