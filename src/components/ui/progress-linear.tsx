import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressLinearProps extends React.HTMLAttributes<HTMLDivElement> {
  indeterminate?: boolean
  value?: number
}

const ProgressLinear = React.forwardRef<HTMLDivElement, ProgressLinearProps>(
  ({ className, indeterminate = false, value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative h-1 w-full overflow-hidden rounded-full bg-gray-200", className)}
        {...props}
      >
        {indeterminate ? (
          <div className="absolute inset-0">
            <div className="h-full w-1/3 animate-[translateX(0)_2s_ease-in-out_infinite] bg-blue-500" 
                 style={{ 
                   animation: 'slide 2s ease-in-out infinite',
                 }} />
          </div>
        ) : (
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{
              width: `${Math.min(100, Math.max(0, value))}%`,
            }}
          />
        )}
      </div>
    )
  }
)

ProgressLinear.displayName = "ProgressLinear"

export { ProgressLinear }