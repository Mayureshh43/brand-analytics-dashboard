import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to your error reporting service
    console.error('Error Boundary Caught:', error, errorInfo);
    
    this.reportErrorToBackend(error, errorInfo);
  }

  reportErrorToBackend = async (error, errorInfo) => {
    try {
      await fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          stack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (reportError) {
      console.error('Error reporting failed:', reportError);
    }
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            🚨 Something went wrong
          </h2>
          <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              onClick={this.handleReload}
              className="btn btn-primary"
              style={{ marginRight: '1rem' }}
            >
              🔄 Refresh Page
            </button>
            <button 
              onClick={this.handleReset}
              className="btn"
              style={{ backgroundColor: '#6b7280', color: 'white' }}
            >
              🏠 Go to Home
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ textAlign: 'left', marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', color: '#dc2626' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                backgroundColor: '#1f2937', 
                color: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '4px',
                overflow: 'auto',
                marginTop: '0.5rem'
              }}>
                {this.state.error && this.state.error.toString()}
                {'\n'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;