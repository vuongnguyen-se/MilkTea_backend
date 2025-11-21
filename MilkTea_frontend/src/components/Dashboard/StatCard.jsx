import { Card } from "antd";
import "../../styles/StatCard.css";

export default function StatCard({ title, value, sub, color, icon, style }) {
  return (
    <Card className="stat-card" style={{ ...style, flex: 1, borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, color: "#666" }}>{title}</p>
          <h2 style={{ margin: 0 }}>{value}</h2>
          <small style={{ color: "#888" }}>{sub}</small>
        </div>

        <div style={{ fontSize: 28, color }}>{icon}</div>
      </div>
    </Card>
  );
}
