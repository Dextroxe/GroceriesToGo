
const Features = () => {
  return (
    <section className="flex flex-col md:flex-row justify-center gap-6 mt-10 px-10">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <span className="text-green-500 text-3xl">✅</span>
        <div>
          <h3 className="text-lg font-semibold">100% Uptime</h3>
          <p className="text-gray-500">Quality Assured</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <span className="text-orange-500 text-3xl">🚀</span>
        <div>
          <h3 className="text-lg font-semibold">Fast Response</h3>
          <p className="text-gray-500">7-weeks bug fix's</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
