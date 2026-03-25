import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { EnergySelector } from './EnergySelector';
import type { EnergyLevel } from '../types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (level: EnergyLevel) => void;
  currentLevel?: EnergyLevel;
}

export function CheckInModal({ isOpen, onClose, onSelect, currentLevel }: CheckInModalProps) {
  const handleSelect = (level: EnergyLevel) => {
    onSelect(level);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 bg-white rounded-2xl shadow-2xl z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">👋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling?</h2>
              <p className="text-gray-500">
                Your energy state helps me suggest the right tasks for you.
              </p>
            </div>

            <EnergySelector onSelect={handleSelect} currentLevel={currentLevel} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
