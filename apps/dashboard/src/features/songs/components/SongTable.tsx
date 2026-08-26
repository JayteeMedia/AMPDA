import DataTable from "../../../shared/components/tables/DataTable.js";
import StatusBadge from "../../../shared/components/badges/StatusBadge.js";

import type { Song } from "../types/Song.js";

interface SongTableProps {

  songs: Song[];

}

export default function SongTable({

  songs,

}: SongTableProps) {

  return (

    <DataTable

      headers={[

        "Title",

        "Artist",

        "Genre",

        "Status",

        "BPM",

        "Key",

      ]}

    >

      {

        songs.map(

          song => (

            <tr key={song.id}>

              <td style={{ padding: 12 }}>
                {song.title}
              </td>

              <td style={{ padding: 12 }}>
                {song.artist}
              </td>

              <td style={{ padding: 12 }}>
                {song.genre}
              </td>

              <td style={{ padding: 12 }}>
                <StatusBadge
                  status={song.status}
                />
              </td>

              <td style={{ padding: 12 }}>
                {song.bpm}
              </td>

              <td style={{ padding: 12 }}>
                {song.key}
              </td>

            </tr>

          ),

        )

      }

    </DataTable>

  );

}
