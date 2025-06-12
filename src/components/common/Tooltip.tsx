'use client'

import React, { useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow,
  FloatingArrow,
  useTransitionStyles,
} from '@floating-ui/react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  tooltipOffset?: number;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  className = "", 
  placement = 'top',
  tooltipOffset = 6,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    placement: placement,
    strategy: 'absolute',
    transform: true,
    middleware: [
      offset(tooltipOffset),
      flip({
        fallbackAxisSideDirection: "start",
        crossAxis: false,
      }),
      shift({ padding: 8 }),
      arrow({
        element: arrowRef,
      }),
    ],
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { 
    move: false,
    delay: { open: 50, close: 0 }
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: { open: 180, close: 120 },
  });

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              ...styles,
              zIndex: 9999,
            }}
            {...getFloatingProps()}
            className={`
              relative p-3 rounded-xl shadow-2xl text-sm max-w-xs
              backdrop-blur-xl
              bg-gradient-to-br from-white/15 via-white/8 to-white/3
              text-white/95 tracking-wide whitespace-pre-line
              before:absolute before:inset-0 before:rounded-xl 
              before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
              ${className}
            `}
          >
            {/* Inner subtle glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/8 via-purple-400/5 to-pink-400/8 pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              {content}
            </div>
            
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-white/15 drop-shadow-sm"
              width={12}
              height={6}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};