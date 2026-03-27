export default function Alert({ type = 'info', message }) {
  if (!message) return null;
  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error:   'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    info:    'bg-blue-50 border-blue-300 text-blue-800',
  };
  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm mb-4 ${styles[type]}`}>
      {icons[type]} {message}
    </div>
  );
}
