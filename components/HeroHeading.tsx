"use client";

import { useEffect, useState } from "react";

const words = ["purpose.", "clarity.", "impact.", "meaning."];

export default function HeroHeading() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState(words[0]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const complete = text === word;
    const empty = text === "";
    const pause = complete ? 1250 : deleting ? 52 : 95;
    const timer = window.setTimeout(() => {
      if (complete && !deleting) setDeleting(true);
      else if (empty && deleting) {
        setDeleting(false);
        setWordIndex(index => (index + 1) % words.length);
      } else setText(value => deleting ? word.slice(0, value.length - 1) : word.slice(0, value.length + 1));
    }, pause);
    return () => window.clearTimeout(timer);
  }, [text, deleting, wordIndex]);

  return <h1>Design with <span className="typing-word">{text}<i aria-hidden="true" /></span></h1>;
}
