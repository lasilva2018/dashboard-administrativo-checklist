import { APP_LOGO } from "@/lib/constants";

export default function LogoPensou() {
  return (
    <div className="w-full bg-white py-4 px-3 rounded-lg shadow-md">
      <img
        src={APP_LOGO}
        alt="Grupo Pensou"
        className="w-full h-auto object-contain"
      />
    </div>
  );
}
