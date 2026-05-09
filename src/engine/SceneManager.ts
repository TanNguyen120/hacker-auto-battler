import { state } from './State';
import { setupDraggable, refundItem, setOnStateChange, unequipItem } from './Actions';
import { BattleEngine } from './BattleEngine';

export class SceneManager {
  private static app = document.getElementById('app')!;
  private static activeBattle: BattleEngine | null = null;

  static init() {
    setOnStateChange(() => this.loadShop());
  }

  static applyTransition(callback: () => void) {
    if (this.activeBattle) {
      this.activeBattle.stop();
      this.activeBattle = null;
    }
    this.app.classList.add('glitch-transition');
    setTimeout(() => {
      callback();
      setTimeout(() => {
        this.app.classList.remove('glitch-transition');
      }, 150);
    }, 150);
  }

  static loadShop() {
    this.applyTransition(() => {
      const canEnterBattle = state.equippedLoadout.length > 0;
      
      this.app.innerHTML = `
        <div class="scene shop-scene">
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
            <div style="margin-top: 10px; font-family: monospace; color: #0f0;">
              ${canEnterBattle ? '[BREACH_READY: TRUE]' : '[ERROR: NO_HARDWARE_EQUIPPED]'}
            </div>
            <button id="btn-execute" ${canEnterBattle ? '' : 'disabled'} style="margin-top: 15px; opacity: ${canEnterBattle ? 1 : 0.5}; cursor: ${canEnterBattle ? 'pointer' : 'not-allowed'};">INITIATE_BATTLE.EXE</button>
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
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <p>Hardware Shop (Drag to Buy):</p>
                  <div style="font-size: 10px; color: #000080; background: #fff; padding: 2px 5px; border: 1px inset #808080;">PC SLOTS: ${state.equippedLoadout.length}/3</div>
                </div>
                
                <div class="item-row" id="shop-items-container">
                  ${state.shopItems.map((item, index) => `
                    <div class="item-slot shop-item" id="shop-${index}" style="touch-action: none; position: relative;">
                      <svg width="24" height="24" style="pointer-events: none;">
                        <use href="icons.svg#${item.data.type}"></use>
                      </svg>
                      <div style="font-size: 8px; pointer-events: none;">${item.data.name}<br>$${item.data.price}</div>
                    </div>
                  `).join('')}
                </div>

                <p style="margin-top: 10px;">PC Internals (Equipped):</p>
                <div class="item-row" id="pc-slots-container" style="min-height: 80px; background: rgba(0,0,128,0.1); border: 2px solid #000080;">
                   ${state.equippedLoadout.length === 0 ? '<div style="font-size: 10px; padding: 10px; color: #888; pointer-events: none;">No items equipped</div>' : ''}
                   ${state.equippedLoadout.map((item) => `
                    <div class="item-slot equipped-item" style="border: 1px solid #000080; background: #c0c0c0;">
                      <button class="unequip-btn" data-id="${item.id}" style="position: absolute; top: 2px; right: 2px; width: 14px; height: 14px; padding: 0; font-size: 8px; cursor: pointer;">x</button>
                      <svg width="24" height="24" style="pointer-events: none;">
                        <use href="icons.svg#${item.type}"></use>
                      </svg>
                      <div style="font-size: 8px; pointer-events: none;">${item.name}</div>
                    </div>
                  `).join('')}
                </div>

                <p style="margin-top: 10px;">Your Inventory:</p>
                <div class="item-row" id="inventory-container" style="min-height: 80px; background: rgba(0,0,0,0.05); border: 2px dashed #808080;">
                  ${state.inventory.length === 0 ? '<div style="font-size: 10px; padding: 10px; color: #888; pointer-events: none;">Drop Items Here</div>' : ''}
                  ${state.inventory.map((item, index) => `
                    <div class="item-slot inventory-item" id="inv-${index}" style="touch-action: none; position: relative; opacity: ${state.equippedLoadout.some(e => e.id === item.data.id) ? 0.5 : 1}">
                      <button class="refund-btn" data-index="${index}" aria-label="Close">x</button>
                      <svg width="24" height="24" style="pointer-events: none;">
                        <use href="icons.svg#${item.data.type}"></use>
                      </svg>
                      <div style="font-size: 8px; pointer-events: none;">${item.data.name}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="status-bar">
                <p class="status-bar-field">Credits: $${state.gold}</p>
                <p class="status-bar-field">Inventory: ${state.inventory.length}</p>
                <p class="status-bar-field">CPU: 80486DX</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Re-bind Shop Logic
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

      document.querySelectorAll('.refund-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
          refundItem(index);
        });
        btn.addEventListener('pointerdown', (e) => e.stopPropagation());
      });
      
      document.querySelectorAll('.unequip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
          unequipItem(id);
        });
      });

      document.getElementById('btn-execute')?.addEventListener('click', () => {
        if (canEnterBattle) this.loadBattle();
      });
    });
  }

  static loadBattle() {
    this.applyTransition(() => {
      this.app.innerHTML = `
        <div class="scene battle-scene">
          <div class="battle-layout">
            <div class="scanline"></div>
            
            <div id="enemy-section">
              <div class="battle-status">Target: Mainframe_Firewall</div>
              <div id="enemy-row" class="hardware-row"></div>
            </div>

            <div id="firewall-section">
              <div class="battle-status">Integrity Breach Progress</div>
              <div class="firewall-container">
                <div id="firewall-fill" class="firewall-fill"></div>
              </div>
            </div>

            <div id="player-section">
              <div id="player-row" class="hardware-row"></div>
              <div class="battle-status" style="margin-top: 15px;">
                <button id="btn-retreat" style="background: #c0c0c0; color: #000; padding: 5px 20px; font-weight: bold; border: 2px outset #fff;">ABORT_MISSION.EXE</button>
              </div>
            </div>

          </div>
        </div>
      `;

      this.activeBattle = new BattleEngine();
      this.activeBattle.start();

      document.getElementById('btn-retreat')?.addEventListener('click', () => this.loadShop());
    });
  }
}
