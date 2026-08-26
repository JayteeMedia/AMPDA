interface EmptyStateProps {

  message: string;

}

export default function EmptyState({

  message,

}: EmptyStateProps) {

  return (

    <div

      style={{

        padding: 40,

        textAlign: "center",

        color: "#94A3B8",

        border: "1px dashed #374151",

        borderRadius: 12,

      }}

    >

      {message}

    </div>

  );

}
