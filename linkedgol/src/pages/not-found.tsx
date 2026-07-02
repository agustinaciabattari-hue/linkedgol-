import { Link } from "wouter";
import { Button } from "@/components/ui/shared";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-display font-black text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mt-4 mb-2">Página no encontrada</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Parece que la pelota se fue afuera. La página que estás buscando no existe o fue movida.
        </p>
        <Link href="/">
          <Button size="lg">Volver a la cancha (Inicio)</Button>
        </Link>
      </div>
    </div>
  );
}
