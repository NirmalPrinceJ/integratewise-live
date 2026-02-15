// L2 Cognitive Layer - Sliding Panel System

// Core sliding panel component
export { SlidingPanel } from "./sliding-panel";
export type { PanelPosition, PanelSize } from "./sliding-panel";

// Provider-based panel system (alternative)
export {
    CognitivePanelProvider,
    useCognitivePanel
} from "./cognitive-panel-provider";
export type { CognitiveSurface } from "./cognitive-panel-provider";

// Trigger components
export {
    CognitiveTrigger,
    CognitiveLink,
    ExplainButton,
    CognitiveToolbar,
    CommandPaletteTrigger
} from "./cognitive-triggers";

// Main L2 Layer (event-driven)
export {
    CognitiveLayer,
    openCognitiveLayer,
    openEvidence
} from "./CognitiveLayer";
