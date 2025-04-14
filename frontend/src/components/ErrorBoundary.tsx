import React, { Component, ReactNode } from 'react';
import { Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Typography variant="h4" color="error">Algo deu errado!</Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Recarregar
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
