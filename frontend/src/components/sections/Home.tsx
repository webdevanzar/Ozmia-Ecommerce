import { useOutletContext } from "react-router-dom";

import React from "react";
import { AboutSection } from "./AboutSection";
import { ProductSection } from "./ProductSection";
import { CollectionSection } from "./CollectionSection";
import { FeedbackSection } from "./FeedbackSection";
import { HistorySection } from "./HistorySection";
import { BannerCarousel } from "./BannerCarousel";
import { BannerSection } from "./BannerSection";

type RefContext = {
  refs: {
    aboutRef: React.RefObject<HTMLDivElement>;
    collectionRef: React.RefObject<HTMLDivElement>;
    shopRef: React.RefObject<HTMLDivElement>;
  };
};

const scrollTo = (ref: React.RefObject<HTMLDivElement | null> | undefined) => {
  if (!ref?.current) return;
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

const Home = () => {
  const { refs } = useOutletContext<RefContext>();

  return (
    <>
      <div className="bg-[linear-gradient(296.61deg,_#00CF67_13.41%,_#009C4E_29.39%,_#008542_54.49%,_#006131_68.42%,_#004A25_99.14%)]">
        <BannerCarousel />
        <BannerSection scrollTo={scrollTo} ref={refs.aboutRef} />
      </div>
      <div ref={refs.aboutRef}>
        <AboutSection />
      </div>
      <div ref={refs.shopRef}>
        <ProductSection />
      </div>
      <div ref={refs.collectionRef}>
        <CollectionSection />
      </div>
      <FeedbackSection />
      <HistorySection />
    </>
  );
};

export default Home;
