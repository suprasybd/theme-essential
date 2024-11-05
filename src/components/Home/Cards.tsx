const Cards = () => {
  return (
    <div className="mb-24">
      <div>
        <h1 className="text-5xl font-bold">Eid-Al-Fitr 2024</h1>
        <p className="py-4 text-lg font-medium">
          Introducing Goodybro's Eid Collection 2024: Embrace Elegance,
          Illuminate the Festivities! Wear Goodness!
        </p>
      </div>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl: xl:grid-cols-4 mt-5">
        <div className="rounded-xl overflow-hidden shadow-lg relative">
          <span className="bg-green-500 text-white px-2 py-1 absolute top-5 right-5 rounded-tr font-semibold">
            25% Off
          </span>
          <img
            className="w-full"
            src="https://vibegaming.com.bd/wp-content/uploads/2023/07/WhatsApp-Image-2024-03-31-at-03.51.41_2d0e3e62.jpg"
            alt="Zifriend ZA981 Gaming Headset"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Zifriend ZA981</div>
            <p className="text-gray-700 text-base">
              <span className="text-red-500 line-through">Tk2,849.00</span>{' '}
              <span className="px-3">Tk2,799.00</span>
            </p>
          </div>
          <div className="px-6 pt-4 pb-2">
            <div className="flex justify-center pb-2">
              <button className="w-full outline outline-3 outline-gray-600 hover:outline-black text-black font-bold py-2 px-4 rounded-xl">
                Choose Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
