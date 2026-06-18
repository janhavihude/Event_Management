import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  const numericValue = typeof value === 'string'
    ? parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
    : value;

  const displaySuffix = typeof value === 'string'
    ? value.replace(/[0-9,]/g, '')
    : suffix;

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = numericValue;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <motion.span ref={ref}>
      {count.toLocaleString()}{displaySuffix}
    </motion.span>
  );
};

export default AnimatedCounter;
