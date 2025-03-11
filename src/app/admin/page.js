import MenuAdmin from "../component/menu/MenuAdmin";

export default function Home() {
  return (
    <div>
      <div
        className="relative min-h-screen bg-white"
      >
        <MenuAdmin />
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-black text-center">
            Bienvenue chez Papa Louis!
          </h1>
        </div>
      </div>
    </div>
  );
}