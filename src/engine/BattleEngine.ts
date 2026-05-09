import { state, type ItemData } from './State';

export interface HardwareItem extends ItemData {
  currentCooldown: number;
}

export class BattleEngine {
  private playerLoadout: HardwareItem[];
  private enemyLoadout: HardwareItem[];
  private firewallIntegrity: number = 50;
  private intervalId: number | null = null;
  private tickRate: number = 100; // ms

  constructor() {
    // Map equipped loadout from global state to battle-ready items
    this.playerLoadout = state.equippedLoadout.map(item => ({
      ...item,
      currentCooldown: item.cooldown
    }));

    // Generate random enemy loadout from shop manifest
    this.enemyLoadout = this.generateEnemyLoadout();
  }

  private generateEnemyLoadout(): HardwareItem[] {
    const availableItems = state.shopItems.map(si => si.data);
    const selected: HardwareItem[] = [];
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const item = availableItems[randomIndex];
      selected.push({
        ...item,
        id: `e-${i}-${item.id}`, // Unique ID for enemy items
        currentCooldown: item.cooldown
      });
    }
    
    return selected;
  }

  start() {
    this.renderInitial();
    this.intervalId = window.setInterval(() => this.tick(), this.tickRate);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    // Player Attacks
    this.playerLoadout.forEach(item => {
      item.currentCooldown--;
      if (item.currentCooldown <= 0) {
        this.firewallIntegrity += item.damage;
        item.currentCooldown = item.cooldown;
        this.flashItem(`item-${item.id}`, '#0f0');
      }
    });

    // Enemy Attacks
    this.enemyLoadout.forEach(item => {
      item.currentCooldown--;
      if (item.currentCooldown <= 0) {
        this.firewallIntegrity -= item.damage;
        item.currentCooldown = item.cooldown;
        this.flashItem(`item-${item.id}`, '#f00');
      }
    });

    // Clamp and Check End Conditions
    this.firewallIntegrity = Math.max(0, Math.min(100, this.firewallIntegrity));
    this.render();

    if (this.firewallIntegrity <= 0) {
      this.stop();
      alert("CONNECTION TERMINATED: YOU WERE HACKED.");
    } else if (this.firewallIntegrity >= 100) {
      this.stop();
      alert("BREACH SUCCESSFUL: ACCESS GRANTED.");
    }
  }

  private renderInitial() {
    const playerRow = document.getElementById('player-row');
    const enemyRow = document.getElementById('enemy-row');

    if (playerRow) {
      playerRow.innerHTML = this.playerLoadout.map(item => this.createItemHTML(item)).join('');
    }
    if (enemyRow) {
      enemyRow.innerHTML = this.enemyLoadout.map(item => this.createItemHTML(item)).join('');
    }
  }

  private createItemHTML(item: HardwareItem): string {
    return `
      <div id="item-${item.id}" class="battle-item-slot" style="position: relative; width: 60px; height: 60px; border: 2px outset #dfdfdf; background: #c0c0c0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <svg width="32" height="32" style="pointer-events: none;">
          <use href="icons.svg#${item.type}"></use>
        </svg>
        <div class="cooldown-overlay" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; background: rgba(0,0,255,0.3); transition: height 0.1s linear;"></div>
      </div>
    `;
  }

  private flashItem(id: string, color: string) {
    const el = document.getElementById(id);
    if (el) {
      el.style.backgroundColor = color;
      setTimeout(() => {
        el.style.backgroundColor = '#c0c0c0';
      }, 100);
    }
  }

  private render() {
    const fill = document.getElementById('firewall-fill');
    if (fill) {
      fill.style.width = `${this.firewallIntegrity}%`;
      // Dynamic color based on health
      if (this.firewallIntegrity > 70) fill.style.background = '#0f0';
      else if (this.firewallIntegrity > 30) fill.style.background = '#ff0';
      else fill.style.background = '#f00';
    }

    // Update cooldown visuals
    [...this.playerLoadout, ...this.enemyLoadout].forEach(item => {
      const el = document.querySelector(`#item-${item.id} .cooldown-overlay`) as HTMLElement;
      if (el) {
        const percent = (item.currentCooldown / item.cooldown) * 100;
        el.style.height = `${percent}%`;
      }
    });
  }
}
