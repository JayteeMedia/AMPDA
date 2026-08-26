interface StatusBadgeProps {

  status: string;

}

export default function StatusBadge({

  status,

}: StatusBadgeProps) {

  return (

    <span

      style={{

        padding: "4px 10px",

        borderRadius: 999,

        background: "#1F2937",

        color: "#E5E7EB",

        fontSize: 12,

        fontWeight: 600,

      }}

    >

      {status}

    </span>

  );

}
