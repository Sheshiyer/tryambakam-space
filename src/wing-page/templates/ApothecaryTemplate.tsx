import * as React from "react";
import { Modal } from "../../components/Modal";
import type { Product } from "../../data/products";
import { PRODUCTS } from "../../data/products";
import { dispatchCTA } from "../../utils/cta-actions";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./apothecary.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function ApothecaryTemplate({ wing, imageUrl, onClose }: Props) {
  const handleCTA = React.useCallback(() => {
    dispatchCTA(wing.ctaAction, { openModal: () => onClose(), onClose });
  }, [wing.ctaAction, onClose]);
  const [titleLines] = React.useState(() => wing.title.split("\n"));
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  return (
    <div className={styles.luxContainer}>
      {/* W10-T07: Bioluminescent ambient glow */}
      <div className={styles.ambientGlow} />

      <header className={styles.topBar}>
        <span className={styles.wingNum}>WING {wing.number}</span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          CLOSE
        </button>
      </header>

      <div className={styles.scrollBody}>
        {/* Hero Title Block — W10-T02: Very tracked-out Panchang */}
        <section className={styles.heroBlock}>
          <h1 className={styles.heroTitle}>
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.heroSubtitle}>{wing.subtitle}</p>
        </section>

        {/* Visual Shelf — Central artwork with generous negative space */}
        <section className={styles.visualShelf}>
          <div className={styles.artFrame}>
            <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.artImage} />
            {/* W10-T04: Subtle engine watermark behind the image */}
            <div className={styles.engineWatermark}>⟐</div>
          </div>
        </section>

        {/* Thesis — W10-T08: Lore text */}
        <section className={styles.thesisSection}>
          <p className={styles.thesisText}>{wing.description}</p>
        </section>

        {/* Spec Labels — W10-T06: Minimalist ingredient label style */}
        <section className={styles.specShelf}>
          {wing.specs.map((spec) => (
            <div key={spec.label} className={styles.specLabel}>
              <span className={styles.specKey}>{spec.label}</span>
              <span className={styles.specDivider} />
              <span className={styles.specValue}>{spec.value}</span>
            </div>
          ))}
        </section>

        {/* Product Feature Cards — W10-T01: Floating shelves */}
        <section className={styles.featureGrid}>
          {wing.features.map((f) => (
            <article key={f.title} className={styles.featureCard}>
              <div className={styles.cardGlow} />
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </article>
          ))}
        </section>

        {/* Product Shelf — Ritual Objects */}
        <section className={styles.productGrid}>
          <h2 className={styles.shelfTitle}>RITUAL OBJECTS</h2>
          <div className={styles.shelf}>
            {PRODUCTS.map((product) => (
              <button type="button" key={product.id} className={styles.productCard} onClick={() => setSelectedProduct(product)}>
                <div className={styles.productImageWrap}>
                  <ProgressiveImage src={product.imageUrl} alt={product.category} className={styles.productImage} />
                </div>
                <span className={styles.productEngine}>{product.engineConnection.split("—")[0].trim()}</span>
                <h3 className={styles.productName}>{product.category}</h3>
                <p className={styles.productDesc}>{product.description}</p>
                <div className={styles.productMeta}>
                  <span>{product.materials}</span>
                  <span className={styles.productPrice}>{product.priceRange}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <button type="button" className={styles.ctaBtn} onClick={handleCTA}>
            {wing.cta}
          </button>
        </section>
      </div>

      <Modal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.category ?? ""}
        maxWidth={520}
      >
        {selectedProduct && (
          <div className={styles.productModal}>
            <div className={styles.productModalImageWrap}>
              <ProgressiveImage src={selectedProduct.imageUrl} alt={selectedProduct.category} className={styles.productModalImage} />
            </div>
            <div className={styles.productEngineTag}>{selectedProduct.engineConnection}</div>
            <p>{selectedProduct.description}</p>
            <h3>Materials</h3>
            <p>{selectedProduct.materials}</p>
            <h3>Investment</h3>
            <p className={styles.priceDisplay}>{selectedProduct.priceRange}</p>
            <button type="button" className={styles.reserveBtn} onClick={() => setSelectedProduct(null)}>
              COMING SOON — RESERVE
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ApothecaryTemplate;
