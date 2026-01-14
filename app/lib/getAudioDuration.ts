export function getAudioDurationSeconds(audioUrl: string): Promise<number> {
  // ✅ Server-side guard (Next.js will run some code on the server)
  if (typeof window === "undefined") {
    return Promise.resolve(0);
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = audioUrl;

    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("error", onError);
    };

    const onLoaded = () => {
      cleanup();
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const onError = () => {
      cleanup();
      reject(new Error("Failed to load audio metadata"));
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("error", onError);
  });
}
