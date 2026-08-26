interface PageHeaderProps {

  title: string;

  description?: string;

}

export default function PageHeader({

  title,

  description,

}: PageHeaderProps) {

  return (

    <div
      style={{
        marginBottom: 24,
      }}
    >

      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#E5E7EB",
        }}
      >
        {title}
      </h1>

      {description && (

        <p
          style={{
            marginTop: 8,
            color: "#94A3B8",
          }}
        >
          {description}
        </p>

      )}

    </div>

  );

}
