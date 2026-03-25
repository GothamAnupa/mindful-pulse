import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
];

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: particle.x, opacity: 1, scale: 1 }}
          animate={{
            y: '100vh',
            x: particle.x + (Math.random() - 0.5) * 40,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: `${particle.x}vw`,
            width: 10,
            height: 10,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            zIndex: 9999
          }}
        />
      ))}
    </AnimatePresence>
  );
}
