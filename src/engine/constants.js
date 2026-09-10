// Game constants extracted from the web version
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Food emojis
export const ArrEmoji = [
  '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭',
  '🍍', '🥥', '🥝', '🍆', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕',
  '🍞', '🧀', '🍳', '🥓', '🥩', '🍗', '🌭', '🍔', '🍟', '🍕',
  '🥪', '🌮', '🌯', '🍩', '🍪', '🍰', '🧁', '🥧', '🍫', '🍬',
  '🍭', '🍮', '🍯',
];

// Number of body ball variants
export const Nball = 13;

// Game world
export const SIZE_MAP = 2000;
export const MIN_SCORE = 200;

// Entity counts
export const N_FOOD = 800;  // Use mobile count for native
export const N_SNAKE = 10;  // Use mobile count for native

// Target FPS
export const TARGET_FRAME_MS = 33; // ~30fps

// Bot names
export const NAMES = [
  'Ethan Carter', 'Olivia Brooks', 'Liam Foster', 'Sophia Bennett',
  'Noah Hayes', 'Ava Collins', 'Mason Reed', 'Isabella Turner',
  'Lucas Parker', 'Mia Sanders', 'Benjamin Price', 'Charlotte Morgan',
  'Elijah Cooper', 'Amelia Ward', 'James Richardson', 'Harper Ellis',
  'Alexander Hughes', 'Evelyn Ross', 'Michael Perry', 'Abigail Jenkins',
  'Daniel Powell', 'Emily Simmons', 'Matthew Bryant', 'Ella Griffin',
  'Joseph Russell', 'Scarlett Diaz', 'David Hayes', 'Victoria Cole',
  'Samuel West', 'Grace Foster', 'Andrew Fisher', 'Chloe Barnes',
  'Christopher Long', 'Lily Murphy', 'Joshua Knight', 'Aria Gibson',
  'Nathan Wells', 'Zoey Freeman', 'Ryan Hunter', 'Nora Chapman',
  'Jonathan Burke', 'Hannah Lawson', 'Gabriel Spencer', 'Avery Holland',
  'Christian Walters', 'Layla Porter', 'Aaron Dean', 'Riley Tucker',
  'Tyler Shaw', 'Madison Stevens', 'Logan Matthews', 'Camila Hudson',
  'Brandon Arnold', 'Penelope Pierce', 'Justin Carr', 'Stella Reynolds',
  'Kevin Black', 'Aurora Harper', 'Zachary Woods', 'Natalie Greene',
  'Nathaniel Blake',
];

// Compute base size from screen dimensions
export function computeBaseSize(width, height) {
  const area = width * height;
  const baseSize = Math.sqrt(area / 300);
  return Math.max(65, baseSize);
}

// Get screen dimensions
export function getScreenDimensions() {
  const { width, height } = Dimensions.get('window');
  return { width, height };
}
