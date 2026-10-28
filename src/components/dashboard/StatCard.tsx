export type StatCardProps = {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: string;
  color: string;
};

export default function StatCard({
  title,
  value,
  change,
  description,
  icon,
  color,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>
        <span className={`stat-icon ${color}`}>{icon}</span>
      </div>
      <h2>{value}</h2>
      <div className="stat-footer">
        <span className={`stat-change ${color}`}>{change}</span>
        <span>{description}</span>
      </div>
    </article>
  );
}
