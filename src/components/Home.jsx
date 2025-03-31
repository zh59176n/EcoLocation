function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 text-center px-4">
      <h1 className="text-5xl font-bold text-green-800 mb-6">Welcome to EcoLocation 🌿</h1>
      <p className="text-lg text-gray-700 max-w-xl mb-8">
        This is the home page for your awesome app! Use this space to explain
        what your app does, why it’s helpful, or show sample data.
      </p>
      <div className="space-x-4">
        <a
          href="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
        >
          Go to Login
        </a>
        <a
          href="/about"
          className="bg-white border border-green-600 text-green-800 px-6 py-3 rounded-md hover:bg-green-50"
        >
          About Page
        </a>
      </div>
    </div>
  );
}

export default Home;

