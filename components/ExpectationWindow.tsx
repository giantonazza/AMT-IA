import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

interface ExpectationWindowProps {
  topic: string;
  isVisible: boolean;
}

export function ExpectationWindow({ topic, isVisible }: ExpectationWindowProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg z-50 max-w-md w-full"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              <h3 className="text-lg font-semibold">AMT IA está pensando...</h3>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-5 h-5" />
            </motion.div>
          </div>
          <p className="mt-3 text-sm font-medium">
            {topic}
          </p>
          <motion.div
            className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <div className="h-full bg-white rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

