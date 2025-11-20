import React from 'react';

type State = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<React.PropsWithChildren<Record<string, unknown>>, State> {
  constructor(props: React.PropsWithChildren<Record<string, unknown>>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">Oops! Algo deu errado.</h2>
            <p className="text-gray-300 mb-4">Um erro inesperado ocorreu no aplicativo. Atualize a página ou contate o suporte.</p>
            <pre className="text-xs text-gray-400 bg-[#0b1220] rounded p-3 overflow-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
