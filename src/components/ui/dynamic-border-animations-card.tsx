import React, { useEffect, useRef } from 'react';

const AnimatedCard = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animateBorder = () => {
      const now = Date.now() / 1000;
      const speed = 0.5;
      
      const topX = Math.sin(now * speed) * 100;
      const rightY = Math.cos(now * speed) * 100;
      const bottomX = Math.sin(now * speed + Math.PI) * 100;
      const leftY = Math.cos(now * speed + Math.PI) * 100;
      
      if (topRef.current) topRef.current.style.transform = `translateX(${topX}%)`;
      if (rightRef.current) rightRef.current.style.transform = `translateY(${rightY}%)`;
      if (bottomRef.current) bottomRef.current.style.transform = `translateX(${bottomX}%)`;
      if (leftRef.current) leftRef.current.style.transform = `translateY(${leftY}%)`;
      
      requestAnimationFrame(animateBorder);
    };
    
    const animationId = requestAnimationFrame(animateBorder);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl bg-black/80 backdrop-blur-xl overflow-hidden border border-white/10">
      {/* Animated border elements */}
      <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
        <div ref={topRef} className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>
      
      <div className="absolute top-0 right-0 w-[2px] h-full overflow-hidden">
        <div ref={rightRef} className="w-full h-1/3 bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
        <div ref={bottomRef} className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      </div>
      
      <div className="absolute top-0 left-0 w-[2px] h-full overflow-hidden">
        <div ref={leftRef} className="w-full h-1/3 bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Dynamic Border{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Animations
          </span>
        </h2>
        
        <p className="text-white/60 text-sm mb-6">
          This card features animated border elements that continuously move around the perimeter, 
          creating a dynamic visual effect using React and Tailwind CSS.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                  {item}
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Feature {item}</p>
                <p className="text-white/40 text-xs">Description of feature</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium text-sm hover:opacity-90 transition-opacity">
          Explore More
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none animate-[float_3s_ease-in-out_infinite]" />
    </div>
  );
};

export default AnimatedCard;
