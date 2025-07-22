import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4">
      {/* Title */}
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Task Management Dashboard
      </h1>

      {/* Subtitle */}
      <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl max-w-2xl dark:text-gray-400">
        Add your tasks, edit, delete, and filter easily with a clean dashboard.
      </p>

      {/* Buttons */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* Primary Button */}
        <Link
          to="/task"
          className="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          🚀 Get Started
        </Link>
      </div>
    </section>
  );
}

export default Home;
