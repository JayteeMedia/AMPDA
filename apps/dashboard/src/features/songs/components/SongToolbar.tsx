import Button from "../../../shared/components/buttons/Button.js";
import Toolbar from "../../../shared/components/layout/Toolbar.js";

import SongFilters from "./SongFilters.js";
import SongSearch from "./SongSearch.js";

interface SongToolbarProps {

  search: string;

  genre: string;

  status: string;

  onSearchChange(
    value: string,
  ): void;

  onGenreChange(
    value: string,
  ): void;

  onStatusChange(
    value: string,
  ): void;

  onCreate(): void;

}

export default function SongToolbar({

  search,

  genre,

  status,

  onSearchChange,

  onGenreChange,

  onStatusChange,

  onCreate,

}: SongToolbarProps) {

  return (

    <Toolbar>

      <div

        style={{

          display: "flex",

          gap: 16,

          alignItems: "center",

        }}

      >

        <SongSearch

          value={search}

          onChange={
            onSearchChange
          }

        />

        <SongFilters

          genre={genre}

          status={status}

          onGenreChange={
            onGenreChange
          }

          onStatusChange={
            onStatusChange
          }

        />

      </div>

      <Button

        onClick={onCreate}

      >

        New Song

      </Button>

    </Toolbar>

  );

}
