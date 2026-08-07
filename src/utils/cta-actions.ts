import type { CTAAction } from "../wing-page/data";

export interface CTACallbacks {
  openModal?: (modalId: string) => void;
  navigate?: (route: string) => void;
  onClose?: () => void;
}

export const CTA_MODAL_CONTENT = {
  "field-initiation": {
    title: "Field Initiation",
    body: "Begin with a 90-second breath check, then choose the engine lens that best matches your current state.",
  },
  "biosensor-dashboard": {
    title: "Biosensor Dashboard",
    body: "A local preview of the clarity-over-anxiety dashboard: HRV readiness, timing windows, and act-or-wait guidance.",
  },
  "agents-detail": {
    title: "Witness Agents",
    body: "Pichet holds the container. Aletheos surfaces what is concealed. The pair turns structure and flow into practice.",
  },
  "protocol-launcher": {
    title: "Protocol Launcher",
    body: "Select a short initiation protocol, pair it with breath and attention, and let the system orient the next practice step.",
  },
  "product-grid": {
    title: "Apothecary Collection",
    body: "A local preview of the physical ritual layer: botanicals, oils, and field objects mapped to verified engine entries.",
  },
  "access-points": {
    title: "Access Points",
    body: "Open the engine map, read Somatic Canticles, enter the Noesis terminal, or return to the writing archive.",
  },
} as const;

export type CTAModalId = keyof typeof CTA_MODAL_CONTENT;

export function isCTAModalId(value: string): value is CTAModalId {
  return Object.prototype.hasOwnProperty.call(CTA_MODAL_CONTENT, value);
}

export function getCTAHref(action: CTAAction): string {
  if (action.type === "external") return action.target;
  return `#${action.target}`;
}

export function openCTAModal(modalId: string): void {
  window.dispatchEvent(new CustomEvent("tn:cta-modal", { detail: { modalId } }));
}

export function navigateToRoute(route: string): void {
  window.location.hash = route.startsWith("#") ? route.slice(1) : route;
}

export function createCTACallbacks(onClose?: () => void): CTACallbacks {
  return {
    openModal: openCTAModal,
    navigate: navigateToRoute,
    onClose,
  };
}

export function dispatchCTA(action: CTAAction, callbacks: CTACallbacks = createCTACallbacks()): void {
  switch (action.type) {
    case "modal":
      (callbacks.openModal ?? openCTAModal)(action.target);
      break;
    case "route":
      if (callbacks.navigate) {
        callbacks.navigate(action.target);
      } else {
        navigateToRoute(action.target);
      }
      break;
    case "external":
      window.open(action.target, "_blank", "noopener,noreferrer");
      break;
    case "scroll": {
      const el = document.getElementById(action.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (callbacks.navigate) {
        callbacks.navigate(action.target);
      } else {
        navigateToRoute(action.target);
      }
      break;
    }
  }
}
