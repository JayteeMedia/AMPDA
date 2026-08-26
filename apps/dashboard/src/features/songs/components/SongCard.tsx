import Card from "../../../shared/components/cards/Card.js";
import StatusBadge from "../../../shared/components/badges/StatusBadge.js";

import type { Song } from "../types/Song.js";

interface SongCardProps {

  song: Song;

}

export default function SongCard({

  song,

}: SongCardProps) {

  return (

    <Card>

      <h3>{song.title}</h3>

      <p>{song.artist}</p>

      <p>{song.genre}</p>

      <StatusBadge
        status={song.status}
      />

    </Card>

  );

}
