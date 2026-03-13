import type { CTAAction } from "../wing-page/data";

export interface CTACallbacks {
  openModal: (modalId: string) => void;
  navigate?: (route: string) => void;
  onClose?: () => void;
}

export function dispatchCTA(action: CTAAction, callbacks: CTACallbacks): void {
  switch (action.type) {
    case "modal":
      callbacks.openModal(action.target);
      break;
    case "route":
      if (callbacks.navigate) {
        callbacks.navigate(action.target);
      }
      break;
    case "external":
      window.open(action.target, "_blank", "noopener,noreferrer");
      break;
    case "scroll": {
      const el = document.getElementById(action.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      break;
    }
  }
}
