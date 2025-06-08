import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { InstanceInfo } from "@/entities/instance"
import { cn } from "@/lib/utils"

export interface InstanceSelectorProps {
	instances: InstanceInfo[]
	onChange: (instance: InstanceInfo) => void
}

export function InstanceSelector({
	instances,
	onChange,
}: InstanceSelectorProps) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	const handleChange = (value: string) => {
		const instance = instances.find((instance) => instance.id === value)
		if (instance) {
			setValue(instance.name)
			onChange(instance)
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between w-[400px]"
				>
					{value
						? instances.find((instance) => instance.name === value)?.name
						: "インスタンスを選択してください"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0">
				<Command>
					<CommandInput placeholder="インスタンスを検索..." />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{instances.map((instance) => (
								<CommandItem
									key={instance.id}
									value={instance.name}
									onSelect={() => {
										handleChange(instance.id)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === instance.name ? "opacity-100" : "opacity-0",
										)}
									/>
									{instance.name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
