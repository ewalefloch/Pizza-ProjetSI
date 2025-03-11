import Menu from "./component/menu/Menu";
import imagePizza from "../../public/image/pizza.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div
        className="relative min-h-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${imagePizza.src})` }}
      >
        <Menu />
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            Bienvenue chez Papa Louis!
          </h1>
        </div>
      </div>
    </div>
  );
}