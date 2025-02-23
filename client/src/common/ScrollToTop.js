import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowUpToLine, ChevronsUp   } from 'lucide-react';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300); // Mostra il pulsante se lo scroll è maggiore di 300px
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',  
            right: '20px',   
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          <ArrowUpCircle  
            size={35}
            color="#86BC25" 
          />
        </button>
      )}
    </>
  );
}

export default ScrollToTop;
