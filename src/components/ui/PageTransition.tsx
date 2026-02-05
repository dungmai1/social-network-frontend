"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset animation on route change
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`${className} ${isVisible ? 'animate-in' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

// Wrapper for staggered list animations
export function StaggeredList({ 
  children, 
  className = "",
  delay = 50 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className} ${isVisible ? 'stagger-children' : ''}`}>
      {children}
    </div>
  );
}

// Fade in wrapper
export function FadeIn({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`${className} transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}

// Slide up wrapper
export function SlideUp({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`${className} ${isVisible ? 'slide-up' : 'opacity-0 translate-y-5'}`}
    >
      {children}
    </div>
  );
}

// Scale in wrapper (good for modals/dialogs)
export function ScaleIn({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`${className} ${isVisible ? 'scale-in' : 'opacity-0 scale-95'}`}
    >
      {children}
    </div>
  );
}
