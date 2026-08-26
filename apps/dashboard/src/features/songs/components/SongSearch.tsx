interface SongSearchProps {

  value: string;

  onChange(
    value: string,
  ): void;

}

export default function SongSearch({

  value,

  onChange,

}: SongSearchProps) {

  return (

    <input

      type="search"

      placeholder="Search songs..."

      value={value}

      onChange={

        event =>

          onChange(
            event.target.value,
          )

      }

      style={{

        width: 320,

        padding: "10px 14px",

        borderRadius: 8,

        border: "1px solid #374151",

        background: "#111827",

        color: "#E5E7EB",

      }}

    />

  );

}
