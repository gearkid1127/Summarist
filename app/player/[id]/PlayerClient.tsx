"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./player.module.css";

type PlayerClientProps = {
  title: string;
  author: string;
  audioLink: string;
  imageLink: string;
};

export default function PlayerClient({
  title,
  author,
  audioLink,
  imageLink,
}: PlayerClientProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const el = audioEl; // <- this is the key line

    function handleLoadedMetadata() {
      const d = Number.isFinite(el.duration) ? el.duration : 0;
      setDuration(d);
    }

    function handleTimeUpdate() {
      setProgress(el.currentTime);
    }

    function handleEnded() {
      setIsPlaying(false);
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    el.addEventListener("loadedmetadata", handleLoadedMetadata);
    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("ended", handleEnded);
    el.addEventListener("play", handlePlay);
    el.addEventListener("pause", handlePause);

    return () => {
      el.removeEventListener("loadedmetadata", handleLoadedMetadata);
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("ended", handleEnded);
      el.removeEventListener("play", handlePlay);
      el.removeEventListener("pause", handlePause);
    };
  }, []);

  // Slider -> audio seeking
  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(e.target.value);
    setProgress(nextTime);
    audio.currentTime = nextTime;
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function skipBy(amount: number) {
  const audio = audioRef.current;
  if (!audio) return;

  const nextTime = Math.min(Math.max(audio.currentTime + amount, 0), duration);
  audio.currentTime = nextTime;
  setProgress(nextTime);
}


  return (
    <div className={styles["audio__wrapper"]}>
      <audio ref={audioRef} src={audioLink} />
      <div className={styles["audio__track--wrapper"]}>
        <figure className={styles["audio__track--image-mask"]}>
          <figure className={styles["book__image--wrapper"]}>
            <img className={styles["book__image"]} src={imageLink} alt="" />
          </figure>
        </figure>
        <div className={styles["audio__track--details-wrapper"]}>
          <div className={styles["audio__track--title"]}>{title}</div>
          <div className={styles["audio__track--author"]}>{author}</div>
        </div>
      </div>
      <div className={styles["audio__controls--wrapper"]}>
        <div className={styles["audio__controls"]}>
          <button className={styles["audio__controls--btn"]} onClick={() => skipBy(-10)}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              className={styles["audio__controls--btn-svg"]}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"
              ></path>
            </svg>
          </button>
          <button
            className={styles["audio__controls--btn"]}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className={styles["audio__controls--play-icon"]}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 432h-80V80h80zm144 0h-80V80h80z"></path>
              </svg>
            ) : (
              <svg
                stroke="#fff"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className={styles["audio__controls--play-icon"]}
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M96 448l320-192L96 64v384z"></path>
              </svg>
            )}
          </button>
          <button className={styles["audio__controls--btn"]} onClick={() => skipBy(10)}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className={styles["audio__progress--wrapper"]}>
        <div className={styles["audio__time"]}>{formatTime(progress)}</div>
        <input
          type="range"
          className={styles["audio__progress--bar"]}
          value={progress}
          onChange={handleSeek}
          max={duration}
        />

        <div className={styles["audio__time"]}>{formatTime(duration)}</div>
      </div>
    </div>
  );
}
