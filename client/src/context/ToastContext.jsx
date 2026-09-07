import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const colors = {
  success: { bg: '#EBF8F0', border: '#22A06B', text: '#166534', icon: '#22A06B' },
  error:   { bg: '#FEF2F2', border: '#E5483B', text: '#9B1C1C', icon: '#E5483B' },
  warning: { bg: '#FFFBEB', border: '#F79009', text: '#92400E', icon: '#F79009' },
  info:    { bg: '#EFF6FF', border: '#0EA5E9', text: '#1E40AF', icon: '#0EA5E9' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '400px',
          width: 'calc(100vw - 3rem)',
        }}
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const c = colors[t.type] || colors.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 48, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 48, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '1rem 1.25rem',
                  background: c.bg,
                  border: `1.5px solid ${c.border}`,
                  borderRadius: '0.75rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }}
              >
                <span style={{ color: c.icon, flexShrink: 0, marginTop: '1px' }}>{icons[t.type]}</span>
                <p style={{ flex: 1, fontSize: '0.9rem', color: c.text, fontWeight: 500, lineHeight: 1.5 }}>{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  style={{ color: c.icon, opacity: 0.6, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
