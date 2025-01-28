import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;