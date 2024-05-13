import React, { Component } from "react";
import { ClaimBtn, Container } from "../theme/theme";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <h2 style={{color:"#fff"}}>Something went wrong!</h2>
          <ClaimBtn onClick={() => this.setState({ hasError: false })}>
            Try again
          </ClaimBtn>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
