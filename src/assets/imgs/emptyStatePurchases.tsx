export const EmptyStatePurchases = () => {
  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="#1E88E5" strokeWidth="6">
        <path d="M80 100 L220 100 L240 240 H60 L80 100 Z" fill="none" />
        <path d="M110 70 C110 50, 140 50, 140 70" />
        <path d="M190 70 C190 50, 160 50, 160 70" />
        <circle cx="120" cy="140" r="6" fill="#1E88E5" />
        <circle cx="180" cy="140" r="6" fill="#1E88E5" />
        <path
          d="M120 180 Q150 160 180 180"
          stroke="#1E88E5"
          strokeWidth="5"
          fill="none"
        />
      </g>
      <text
        x="50%"
        y="270"
        fontFamily="Arial, sans-serif"
        fontSize="20"
        fill="#000"
        textAnchor="middle"
      >
        Nenhuma compra
      </text>
      <text
        x="50%"
        y="295"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fill="#444"
        textAnchor="middle"
      >
        Você não tem nenhuma compra.
      </text>
    </svg>
  );
};
