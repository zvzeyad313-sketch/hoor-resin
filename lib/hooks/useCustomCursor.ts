import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posParams = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    document.body.classList.add('hide-cursor-global');
    
    const handleMouseMove = (e: MouseEvent) => {
      posParams.current.mx = e.clientX;
      posParams.current.my = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animateCursor = () => {
      const { mx, my, rx, ry } = posParams.current;
      posParams.current.rx += (mx - rx) * 0.2;
      posParams.current.ry += (my - ry) * 0.2;
      
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.transform = `translate(${mx - 2}px, ${my - 2}px)`;
        ringRef.current.style.transform = `translate(${posParams.current.rx - 28}px, ${posParams.current.ry - 28}px)`;
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    return () => {
      document.body.classList.remove('hide-cursor-global');
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLinkHover = (enter: boolean) => {
    if (ringRef.current) {
      if (enter) {
        ringRef.current.style.width = '50px';
        ringRef.current.style.height = '50px';
        ringRef.current.style.borderColor = 'var(--gold)';
      } else {
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.borderColor = 'var(--rose)';
      }
    }
  };

  const setCursorVisibility = (visible: boolean) => {
    if (visible) {
      document.body.classList.add('hide-cursor-global');
      if (cursorRef.current) cursorRef.current.style.display = 'block';
      if (ringRef.current) ringRef.current.style.display = 'block';
    } else {
      document.body.classList.remove('hide-cursor-global');
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
    }
  };

  return { cursorRef, ringRef, handleLinkHover, setCursorVisibility };
}
