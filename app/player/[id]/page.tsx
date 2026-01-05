// app/player/[id]/page.tsx
import styles from "./page.module.css";
import { getBookById } from "@/app/lib/booksApi";
import PlayerClient from "./PlayerClient"

type PlayerPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  return (
    <div className={styles.summary}>
      <div className={styles["audio__book--summary"]}>
        <div className={styles["audio__book--summary-title"]}>
          <b>{book.title}</b>
        </div>
        <div className={styles["audio__book--summary-text"]}>
          {book.summary}
        </div>
      </div>
      <PlayerClient title={book.title} author={book.author} audioLink={book.audioLink} imageLink={book.imageLink} />
    </div>
  );
}
