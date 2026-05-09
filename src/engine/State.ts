import { Spring2D } from './Physics';

export type HardwareType = 'cdrom' | 'usb' | 'floppy';

export type ItemData = {
  id: string;
  name: string;
  price: number;
  icon: string;
  cooldown: number; // Ticks
  damage: number;
  type: HardwareType;
}

export type DraggableItem = {
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

export type GameState = {
  gold: number;
  shopItems: DraggableItem[];
  inventory: DraggableItem[];
  equippedLoadout: ItemData[];
}

const shopData: ItemData[] = [
  { id: '1', name: 'Floppy Disk', price: 10, icon: '💾', cooldown: 10, damage: 1, type: 'floppy' },
  { id: '2', name: 'CD-ROM', price: 50, icon: '💿', cooldown: 25, damage: 4, type: 'cdrom' },
  { id: '3', name: 'Sound Card', price: 120, icon: '🎵', cooldown: 40, damage: 10, type: 'cdrom' },
  { id: '4', name: 'GPU-98', price: 200, icon: '🎮', cooldown: 50, damage: 20, type: 'usb' },
  { id: '5', name: 'Modem', price: 80, icon: '📞', cooldown: 15, damage: 2, type: 'floppy' },
  { id: '6', name: 'ZIP Drive', price: 150, icon: '📼', cooldown: 30, damage: 8, type: 'floppy' },
  { id: '7', name: 'RAM Stick', price: 90, icon: '📟', cooldown: 20, damage: 3, type: 'usb' },
];

export const state: GameState = {
  gold: 500,
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
  inventory: [],
  equippedLoadout: []
};
