"use client";

import { useRef } from "react";
import styles from "./BookCarousel.module.css";
import BookCard from "@/app/components/books/BookCard";

type Book = {
  id: string;
  // keep loose here so it works with your API shape
  [key: string]: any;
};

interface BookCarouselProps {
  books: Book[];
  loading?: boolean;
}

const SCROLL_AMOUNT = 320; // how far each arrow click scrolls

export default function BookCarousel({ books, loading }: BookCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const amount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    trackRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  // how many skeletons to show while loading
  const skeletons = Array.from({ length: 7 });

  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => scroll("left")}
        aria-label="Scroll books left"
        type="button"
      >
        ‹
      </button>

      <div ref={trackRef} className={styles.track}>
        {loading
          ? skeletons.map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))
          : books.map((book) => (
              <div key={book.id} className={styles.slide}>
                <BookCard book={book} />
              </div>
            ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => scroll("right")}
        aria-label="Scroll books right"
        type="button"
      >
        ›
      </button>
    </div>
  );
}
