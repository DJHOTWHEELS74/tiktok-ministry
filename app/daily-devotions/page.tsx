export default function Page() {
  return (
    <main
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-6 py-20"
      style={{
        backgroundImage: "url('/images/one-way-cross.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="bg-black/70 w-full min-h-screen flex flex-col items-center justify-center px-6 py-20">

        {/* Title row */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">
            Daily Devotions Ministry
          </h1>

          <p className="text-blue-300 mt-2 text-lg font-semibold">
            Under Construction 🚧
          </p>
        </div>

        {/* Main description */}
        <p className="text-gray-300 max-w-2xl text-center text-lg leading-relaxed">
          This ministry exists to encourage, support, and strengthen people living with disabilities,
          their families, and caregivers through faith in Jesus Christ.
        </p>

        {/* Scripture + content */}
        <div className="mt-10 max-w-xl text-center space-y-4 text-gray-400">

          <p>
            “For we walk by faith, not by sight.” — 2 Corinthians 5:7
          </p>

          <p>
            God sees every person with value, purpose, and love. This space will grow into
            testimonies, encouragement, and community support.
          </p>

          <p className="text-blue-300 mt-6">
            Coming soon — stories, encouragement, and faith-based support resources.
          </p>

        </div>

      </div>
    </main>
  );
}