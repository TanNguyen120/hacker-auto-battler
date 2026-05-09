import './style.css'
import { state } from './engine/State'
import { SceneManager } from './engine/SceneManager'

let lastTime = performance.now();

function animate(currentTime: number) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  // Update Shop Items Physics
  state.shopItems.forEach(item => {
    if (item.element) {
      item.spring.update(dt);
      const tilt = item.spring.vx * 0.02;
      item.element.style.transform = `translate3d(${item.spring.x}px, ${item.spring.y}px, 0) rotate(${tilt}deg)`;
    }
  });

  // Update Inventory Items Physics
  state.inventory.forEach(item => {
    if (item.element) {
      item.spring.update(dt);
      const tilt = item.spring.vx * 0.02;
      item.element.style.transform = `translate3d(${item.spring.x}px, ${item.spring.y}px, 0) rotate(${tilt}deg)`;
    }
  });

  requestAnimationFrame(animate);
}

// Boot the game
SceneManager.init();
SceneManager.loadShop();
requestAnimationFrame(animate);
