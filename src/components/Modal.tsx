import * as React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: number;
}

export function Modal({ open, onClose, children, title, maxWidth }: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBackdropClick = React.useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const handleCancel = React.useCallback(
    (e: React.SyntheticEvent<HTMLDialogElement>) => {
      e.preventDefault();
      onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Native <dialog> handles keyboard via onCancel (ESC). Backdrop click has no keyboard equivalent.
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
      aria-label={title || "Dialog"}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
