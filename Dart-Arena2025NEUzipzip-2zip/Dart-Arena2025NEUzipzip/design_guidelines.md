# Darts Zähler App - Design Guidelines

## Design Approach
**System**: Clean, Minimal Utility Interface (inspired by Apple HIG)
- Prioritize clarity, readability, and fast interaction
- Information-dense layout optimized for quick score tracking
- Touch-friendly interface for both desktop and mobile use

## Typography
- **Primary Font**: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI"`)
- **Score Display**: Bold, 4xl-6xl size for current scores
- **Player Names**: 2xl semibold, editable inline
- **Statistics**: Base/lg regular weight for averages and history
- **Buttons**: Uppercase tracking-wide for number pad, medium weight for actions

## Layout System
**Spacing**: Use Tailwind units of 2, 4, 6, 8, and 12 primarily
- **Mobile-First**: Single column, vertically stacked
- **Desktop**: Multi-column layout for players (2-4 columns grid)
- **Max Width**: Container max-w-7xl for game area
- **Padding**: p-4 mobile, p-6 to p-8 desktop

## Core Components

### Game Setup Section
- Player cards with add/remove controls
- Inline editable name fields (click to edit)
- Game configuration controls (Legs, Points per Leg)
- In/Out mode toggles (Double In, Master In, Double Out, Master Out)
- Prominent "Spiel starten" button

### Active Game Interface
**Player Score Cards**:
- Large score display (remaining points)
- Visual distinction for active player (border treatment)
- Three dart input displays (1. Wurf, 2. Wurf, 3. Wurf)
- Current throw total
- Statistics row: Sets count, Legs count, Average
- "Letzten 3" throws history

**Number Pad Interface**:
- Grid layout: 3 columns for numbers 1-20, Bull
- Large touch targets (min 56px height)
- Top row: "Rückgängig", "Double", "Triple" buttons
- Bottom row: "0" (miss) button spanning width
- Clear visual feedback for Double/Triple mode activation

### Statistics Bar
- Checkout suggestions when score ≤ 170
- Turn history / throw log
- Running average calculation

### Controls
- "Beginner wechseln" button (pre-game)
- "Neues Leg" / "Neues Spiel" actions
- Settings access for mid-game adjustments

## Component Library

**Cards**: Rounded corners (rounded-lg), subtle elevation
**Buttons**: 
- Primary actions: Solid with rounded corners
- Number pad: Square with subtle borders, active states
- Icon buttons: Circular for add/remove players

**Forms**:
- Toggle switches for In/Out modes
- Radio buttons for point selection (501/301/101)
- Number input for Legs count

**Overlays**:
- Modal for game settings
- Toast notifications for invalid throws (when Double/Master Out active)

## Interaction Patterns

**Invalid Throw Handling**:
- When Double/Master In active: Prevent score reduction until double/triple thrown
- When Double/Master Out active: Detect bust conditions (score < 2, odd number with double out)
- Clear visual feedback for invalid attempts

**Score Entry Flow**:
1. Tap number → displays in current dart slot
2. Tap Double/Triple → highlights mode → tap number
3. Auto-advance to next dart after entry
4. Auto-switch player after 3 darts or turn completion

**Responsive Behavior**:
- Mobile: Vertical stack, number pad bottom-fixed
- Tablet: 2-column player grid
- Desktop: Up to 4-column player grid, side-by-side layout

## Accessibility
- High contrast for score readability
- Large touch targets (minimum 48x48px)
- Clear active states for all interactive elements
- Keyboard navigation support for number entry
- Screen reader labels for all controls

## Key UX Principles
1. **Zero Latency**: Immediate visual feedback on every tap
2. **Error Prevention**: Smart validation for In/Out modes
3. **Quick Recovery**: Prominent undo button always accessible
4. **Minimal Steps**: Start game in 3 taps or less
5. **Glanceable Info**: Scores readable from distance during play