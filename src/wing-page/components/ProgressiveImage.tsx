import * as React from "react";
import styles from "./ProgressiveImage.module.css";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  className?: string; // Allows passing the template-specific styling
};

export function ProgressiveImage({ src, alt, className, ...rest }: Props) {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // Reset loaded state when src changes
    setLoaded(false);
  }, []);

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      {!loaded && <div className={styles.skeleton} />}
      <img
        {...rest}
        src={src}
        alt={alt}
        className={`${styles.image} ${loaded ? styles.loaded : ""}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
