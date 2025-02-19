import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';

const StyledLogin = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.9);
`;

const LoginPage = () => {
  const cardRef = useRef(null);
  const formElementsRef = useRef([]);

  useEffect(() => {
    // Animate card appearance
    gsap.to(cardRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.7)"
    });

    // Animate form elements
    gsap.to(formElementsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      delay: 0.3,
      ease: "power2.out"
    });
  }, []);

  return (
    <StyledLogin>
      <LoginCard ref={cardRef}>
        <form>
          {/* Add refs to form elements */}
          <div ref={el => formElementsRef.current[0] = el}>
            // ... existing email input ...
          </div>
          <div ref={el => formElementsRef.current[1] = el}>
            // ... existing password input ...
          </div>
          <button ref={el => formElementsRef.current[2] = el}>
            // ... existing button ...
          </button>
        </form>
      </LoginCard>
    </StyledLogin>
  )
}

export default LoginPage