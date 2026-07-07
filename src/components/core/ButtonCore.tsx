import {motion} from "motion/react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  inverted?: boolean;
  className?: string;
}

export default function ButtonCore({ text, onClick, inverted, className="" }: ButtonProps) {
  const inversion = inverted ? "bg-neutral-50 text-slate-950 rounded-lg" : "bg-neutral-950 text-slate-50 rounded-lg"


  return (
      <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          className={`${className} ${inversion}`}
      >
        {text}
      </motion.button>
  )
}