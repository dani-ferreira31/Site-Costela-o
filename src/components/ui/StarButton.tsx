'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface StarButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  disabled?: boolean
}

export function StarButton({ children, onClick, variant = 'primary', className, disabled }: StarButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'relative overflow-hidden px-8 py-4 rounded-full font-accent tracking-widest text-sm uppercase cursor-pointer transition-all duration-300',
        variant === 'primary' && [
          'bg-gradient-to-r from-yellow-600 via-yellow-400 to-amber-300',
          'text-space-deep font-semibold',
          'shadow-[0_0_30px_rgba(212,175,55,0.4),0_0_60px_rgba(212,175,55,0.15)]',
          'hover:shadow-[0_0_40px_rgba(212,175,55,0.6),0_0_80px_rgba(212,175,55,0.25)]',
        ],
        variant === 'ghost' && [
          'border border-yellow-400/40 text-yellow-300',
          'hover:border-yellow-400/70 hover:text-yellow-200',
          'hover:bg-yellow-400/5',
        ],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Shimmer effect */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
      {/* Star particles on hover */}
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </motion.button>
  )
}
