import "../../styles/RecentActivities.css";

export default function RecentActivities({ data }) {
  return (
    <div className="recent">
      <h3 style={{ marginBottom: 10, fontSize: 22, color: "#074799", fontWeight: "bold" }}>Hoạt động gần đây</h3>

      <div className="recent-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map((item, i) => (
          <div
            key={i}
            className="recent-item"
            style={{
              padding: "12px",
              background: "#fff",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{item.time}</div>
              <div>{item.text}</div>
            </div>

            <span
              style={{
                padding: "4px 10px",
                background: item.color,
                color: "#fff",
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
