import * as React from "react";
import { CTA_MODAL_CONTENT, type CTAModalId, isCTAModalId } from "../utils/cta-actions";
import { Modal } from "./Modal";

type CTAModalEvent = CustomEvent<{ modalId?: string }>;

export function CTAModalHost() {
  const [activeModal, setActiveModal] = React.useState<CTAModalId | null>(null);

  React.useEffect(() => {
    const onCTAModal = (event: Event) => {
      const modalId = (event as CTAModalEvent).detail?.modalId;
      if (modalId && isCTAModalId(modalId)) {
        setActiveModal(modalId);
      }
    };

    window.addEventListener("tn:cta-modal", onCTAModal);
    return () => window.removeEventListener("tn:cta-modal", onCTAModal);
  }, []);

  const content = activeModal ? CTA_MODAL_CONTENT[activeModal] : null;

  return (
    <Modal open={!!content} onClose={() => setActiveModal(null)} title={content?.title} maxWidth={560}>
      {content && <p>{content.body}</p>}
    </Modal>
  );
}
