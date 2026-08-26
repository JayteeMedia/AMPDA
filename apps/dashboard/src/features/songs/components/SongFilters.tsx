interface SongFiltersProps {

  genre: string;

  status: string;

  onGenreChange(
    value: string,
  ): void;

  onStatusChange(
    value: string,
  ): void;

}

export default function SongFilters({

  genre,

  status,

  onGenreChange,

  onStatusChange,

}: SongFiltersProps) {

  return (

    <div

      style={{

        display: "flex",

        gap: 12,

      }}

    >

      <select

        value={genre}

        onChange={

          event =>

            onGenreChange(
              event.target.value,
            )

        }

      >

        <option value="">
          All Genres
        </option>

      </select>

      <select

        value={status}

        onChange={

          event =>

            onStatusChange(
              event.target.value,
            )

        }

      >

        <option value="">
          All Status
        </option>

        <option value="Draft">
          Draft
        </option>

        <option value="Completed">
          Completed
        </option>

        <option value="Released">
          Released
        </option>

      </select>

    </div>

  );

}
