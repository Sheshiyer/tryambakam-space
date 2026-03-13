export interface Book {
  index: number;
  title: string;
  chapterCount: number;
  theme: string;
  koshaMapping: string;
  coverUrl: string;
}

export interface Chapter {
  bookIndex: number;
  chapterNumber: number;
  title: string;
}

export const BOOKS: Book[] = [
  {
    index: 0,
    title: "Anamnesis Engine",
    chapterCount: 8,
    theme: "Remembering what was never learned",
    koshaMapping: "Kha-dominant — Spirit, observation, pattern recognition",
    coverUrl: "/images/books/book-anamnesis.png",
  },
  {
    index: 1,
    title: "The Myocardial Chorus",
    chapterCount: 7,
    theme: "The heart as computational organ",
    koshaMapping: "Ba integration — the body as reading instrument",
    coverUrl: "/images/books/book-myocardial.png",
  },
  {
    index: 2,
    title: "The Ripening",
    chapterCount: 12,
    theme: "Integration that doesn't conclude",
    koshaMapping: "La friction — biorhythmic timing resists impulse to consume faster than you integrate",
    coverUrl: "/images/books/book-ripening.png",
  },
];

export const CHAPTERS: Chapter[] = [
  // Book I: Anamnesis Engine (8 chapters)
  { bookIndex: 0, chapterNumber: 1, title: "The Dormant Field" },
  { bookIndex: 0, chapterNumber: 2, title: "Cartography of Forgetting" },
  { bookIndex: 0, chapterNumber: 3, title: "The Witness Instruction" },
  { bookIndex: 0, chapterNumber: 4, title: "Somatic Recursion" },
  { bookIndex: 0, chapterNumber: 5, title: "The Engine Wakes" },
  { bookIndex: 0, chapterNumber: 6, title: "Anamnesis Protocol" },
  { bookIndex: 0, chapterNumber: 7, title: "The First Remembering" },
  { bookIndex: 0, chapterNumber: 8, title: "Signal and Source" },
  // Book II: The Myocardial Chorus (7 chapters)
  { bookIndex: 1, chapterNumber: 1, title: "The Cardiac Cartograph" },
  { bookIndex: 1, chapterNumber: 2, title: "Chambers of Resonance" },
  { bookIndex: 1, chapterNumber: 3, title: "The Pulse Architect" },
  { bookIndex: 1, chapterNumber: 4, title: "Systolic Witness" },
  { bookIndex: 1, chapterNumber: 5, title: "The Diastolic Return" },
  { bookIndex: 1, chapterNumber: 6, title: "Coherence Threshold" },
  { bookIndex: 1, chapterNumber: 7, title: "The Chorus Speaks" },
  // Book III: The Ripening (12 chapters)
  { bookIndex: 2, chapterNumber: 1, title: "Green Architecture" },
  { bookIndex: 2, chapterNumber: 2, title: "The Fruiting Body" },
  { bookIndex: 2, chapterNumber: 3, title: "Mycelial Networks" },
  { bookIndex: 2, chapterNumber: 4, title: "The Weight of Seeds" },
  { bookIndex: 2, chapterNumber: 5, title: "Photosynthetic Witness" },
  { bookIndex: 2, chapterNumber: 6, title: "Root System" },
  { bookIndex: 2, chapterNumber: 7, title: "The Canopy Problem" },
  { bookIndex: 2, chapterNumber: 8, title: "Decomposition Engine" },
  { bookIndex: 2, chapterNumber: 9, title: "The Harvest Question" },
  { bookIndex: 2, chapterNumber: 10, title: "Fermentation" },
  { bookIndex: 2, chapterNumber: 11, title: "The Quine Returns" },
  { bookIndex: 2, chapterNumber: 12, title: "Perpetual Ripening" },
];

export function getChaptersByBook(bookIndex: number): Chapter[] {
  return CHAPTERS.filter((ch) => ch.bookIndex === bookIndex);
}
