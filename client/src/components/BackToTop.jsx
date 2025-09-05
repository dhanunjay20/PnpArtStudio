// src/components/BackToTop.jsx
import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = ({
  threshold = 280,      // show after this many px scrolled
  right = 16,           // px from right
  bottom = 24,          // px from bottom
  zIndex = 1050,        // higher than header/footer overlays
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      setVisible(y > threshold);
    };
    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={`btn btn-danger rounded-circle shadow ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      style={{
        position: "fixed",
        right,
        bottom,
        width: 48,
        height: 48,
        zIndex, // ensure on top of content
        transition: "opacity 180ms ease",
      }}
    >
      <ChevronUp size={22} />
    </button>
  );
};

export default BackToTop;
