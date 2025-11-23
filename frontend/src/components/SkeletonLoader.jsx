
const SkeletonLoader = ({ type = 'tile', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className="skeleton-wrapper">
      {type === 'tile' && <SkeletonTile />}
      {type === 'chart' && <SkeletonChart />}
      {type === 'table' && <SkeletonTable />}
      {type === 'card' && <SkeletonCard />}
    </div>
  ));

  return <>{skeletons}</>;
};

const SkeletonTile = () => (
  <div className="card">
    <div className="skeleton-line" style={{ width: '60%', height: '20px', marginBottom: '1rem' }}></div>
    <div className="skeleton-line" style={{ width: '40%', height: '30px', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-line" style={{ width: '30%', height: '20px' }}></div>
  </div>
);

const SkeletonChart = () => (
  <div className="card">
    <div className="skeleton-line" style={{ width: '50%', height: '24px', marginBottom: '2rem' }}></div>
    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height: `${30 + Math.random() * 70}%`,
            flex: 1,
            borderRadius: '4px 4px 0 0'
          }}
        ></div>
      ))}
    </div>
  </div>
);

const SkeletonTable = () => (
  <div className="card">
    <div className="skeleton-line" style={{ width: '40%', height: '24px', marginBottom: '1.5rem' }}></div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: '1rem' }}>
          <div className="skeleton-line" style={{ flex: 2, height: '20px' }}></div>
          <div className="skeleton-line" style={{ flex: 1, height: '20px' }}></div>
          <div className="skeleton-line" style={{ flex: 1, height: '20px' }}></div>
          <div className="skeleton-line" style={{ flex: 1, height: '20px' }}></div>
          <div className="skeleton-line" style={{ flex: 1, height: '20px' }}></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="card">
    <div className="skeleton-line" style={{ width: '70%', height: '24px', marginBottom: '1rem' }}></div>
    <div className="skeleton-line" style={{ width: '90%', height: '16px', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-line" style={{ width: '80%', height: '16px', marginBottom: '0.5rem' }}></div>
    <div className="skeleton-line" style={{ width: '60%', height: '16px' }}></div>
  </div>
);

export default SkeletonLoader;