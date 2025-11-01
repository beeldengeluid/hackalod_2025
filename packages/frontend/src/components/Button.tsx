import clsx from "clsx"
import styles from "./Button.module.css"

export function Button({
	children,
	disabled,
	onClick,
}: {
	children: React.ReactNode
	disabled?: boolean
	onClick: () => void
}) {
	return (
		<button
			className={clsx(styles.button, { [styles.disabled]: disabled })}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	)
}
