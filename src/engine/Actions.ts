import { state, type DraggableItem } from './State';
import { Spring2D } from './Physics';

let onStateChange: () => void = () => {};

export function setOnStateChange(cb: () => void) {
  onStateChange = cb;
}

export function buyItem(id: string) {
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
    
    // Auto-equip if space available
    if (state.equippedLoadout.length < 3) {
      equipItem(newItem.data.id);
    } else {
      onStateChange();
    }
  } else if (shopItem) {
    console.log("INSUFFICIENT CREDITS");
  }
}

export function refundItem(index: number) {
  const item = state.inventory[index];
  if (item) {
    // If it was equipped, remove it
    unequipItem(item.data.id);
    
    state.gold += item.data.price;
    state.inventory.splice(index, 1);
    onStateChange();
  }
}

export function equipItem(itemId: string) {
  if (state.equippedLoadout.length >= 3) return;
  
  const item = state.inventory.find(i => i.data.id === itemId);
  if (item && !state.equippedLoadout.some(e => e.id === itemId)) {
    state.equippedLoadout.push(item.data);
    onStateChange();
  }
}

export function unequipItem(itemId: string) {
  const index = state.equippedLoadout.findIndex(e => e.id === itemId);
  if (index !== -1) {
    state.equippedLoadout.splice(index, 1);
    onStateChange();
  }
}

export function setupDraggable(item: DraggableItem) {
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
