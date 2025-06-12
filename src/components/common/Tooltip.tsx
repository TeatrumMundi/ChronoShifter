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
            className={`p-3 bg-gray-900 text-white rounded-lg shadow-xl text-sm tracking-normal whitespace-pre-line max-w-xs border border-gray-700 ${className}`}
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-gray-900"
              width={12}
              height={6}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};