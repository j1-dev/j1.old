////  Deprecated component
////
////  This is a component that tilts a wrapped div inside when the mouse is hovered over it
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import VanillaTilt from "vanilla-tilt";
import { useEffect, useRef } from "react";

export const vanillaTiltOptions = {
  max: 9,
  perspective: 170,
};

export function Tilt({ children, setData, className }) {
  const divRef = useRef();

  useEffect(() => {
    const node = divRef.current;
    VanillaTilt.init(node, vanillaTiltOptions);
    node.addEventListener("tiltChange", (event) => setData(event.detail));
    return () => node.vanillaTilt.destroy();
  }, [setData]);

  return (
    <div ref={divRef} className={className}>
      {children}
    </div>
  );
}
