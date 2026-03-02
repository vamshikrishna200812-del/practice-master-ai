interface Props {
  viewed: number;
  total: number;
}

const ProgressTracker = ({ viewed, total }: Props) => {
  const pct = total === 0 ? 0 : Math.round((viewed / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs text-white/50">
        <span>{viewed} of {total} viewed</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #7c3aed, #a855f7)",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressTracker;
