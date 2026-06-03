import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.error("ErrorBoundary caught:", err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {this.props.fallback || "This section couldn't load. Try refreshing the page."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 text-sm text-green-600 dark:text-green-400 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
