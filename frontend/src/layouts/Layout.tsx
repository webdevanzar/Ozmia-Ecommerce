import { Outlet } from "react-router-dom";
import { Footer } from "../components/sections/Footer";
import { useRef } from "react";
import { Header } from "../components/sections/Header";

export const Layout = () => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollTo = (
    ref: React.RefObject<HTMLDivElement | null> | undefined
  ) => {
    if (!ref?.current) return;
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-x-hidden">
      <Header
        scrollTo={scrollTo}
        refs={{ aboutRef, collectionRef, shopRef, contactRef }}
      />

      <Outlet context={{ refs: { aboutRef, collectionRef, shopRef } }} />
      <div ref={contactRef}>
        <Footer scrollTo={scrollTo} ref={aboutRef} />
      </div>
    </div>
  );
};
