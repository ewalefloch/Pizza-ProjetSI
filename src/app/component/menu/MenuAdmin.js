'use client';

const MenuAdmin = () => {
  return (
    <div
      className="absolute top-0 left-0 w-full flex justify-start items-center p-6"
      style={{ backgroundColor: "rgba(255, 87, 34, 0.9)" }}
    >
      <h1 className="text-2xl text-white font-bold mr-6 pr-3 border-r-2 border-white">Administration</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <button
              className="text-white hover:text-orange-300"
            >
              Gestion Pizzas
            </button>
          </li>
          <li>
            <button
              className="text-white hover:text-orange-300"
            >
              Gestion Ingrédients
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuAdmin;
