export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
        {children}
    </div>
);

export const CardContent = ({ children, className = "" }) => (
    <div className={`text-gray-700 ${className}`}>{children}</div>
);
