import { cn } from "@/lib/utils"
import { Loader2 as LoaderIcon } from "lucide-react"
import React from "react"

export interface SpinnerProps extends React.HTMLAttributes<HTMLOrSVGElement> {}

export const Spinner: React.FC<SpinnerProps> = ({ className, ...props }) => {
	return <LoaderIcon className={cn("animate-spin", className)} />
}

export default Spinner
