import { useStore } from '@nanostores/react';
import { isDeferred, isActivated, activateText, activate } from '../stores/deferred-store.js';

export default function ActivateOverlay() {
  const activated = useStore(isActivated);

  if (!isDeferred || activated) {
    return null;
  }

  const displayText = (activateText ?? 'Start Tutorial').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      <button
        onClick={activate}
        className="inline-flex items-center font-500 text-sm rounded-md cursor-pointer transition-all duration-150"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#4f46e5',
          borderColor: '#4f46e5',
          border: '1px solid #4f46e5',
          color: '#ffffff',
          borderRadius: '0.375rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4338ca';
          e.currentTarget.style.borderColor = '#4338ca';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#4f46e5';
          e.currentTarget.style.borderColor = '#4f46e5';
        }}
      >
        {displayText}
      </button>
    </div>
  );
}
