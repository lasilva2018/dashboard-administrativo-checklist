export default function LogoSidebar() {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {/* Ícone simplificado do Grupo Pensou */}
      <div className="flex items-center gap-2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Símbolo P estilizado */}
          <path
            d="M20 20 L20 80 L50 80 L50 50 L70 50 L70 20 Z M30 30 L60 30 L60 40 L30 40 Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="45" cy="65" r="8" fill="#3B82F6" />
        </svg>
        <div className="flex flex-col">
          <span className="text-xs font-light text-white/80 tracking-wider">GRUPO</span>
          <span className="text-2xl font-bold text-white tracking-tight -mt-1">PENSOU</span>
        </div>
      </div>
      <span className="text-[10px] text-white/60 tracking-wide uppercase">
        Administração de Condomínios
      </span>
    </div>
  );
}
