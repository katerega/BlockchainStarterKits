export const Card = ({ children, className = "", maxHeight = "400px" }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}
    style={{
      maxHeight: maxHeight,
      overflowY: 'auto'
    }}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`text-gray-700 ${className}`}>{children}</div>
);