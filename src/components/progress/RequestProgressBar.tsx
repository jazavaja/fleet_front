import { useRequestProgress } from './RequestProgressContext.tsx';

const RequestProgressBar = () => {
  const { loading } = useRequestProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '4px',
        width: loading ? '100%' : '0%',
        backgroundColor: 'blue',
        transition: 'width 0.3s ease',
        zIndex: 9999,
      }}
    />
  );
};

export default RequestProgressBar;
