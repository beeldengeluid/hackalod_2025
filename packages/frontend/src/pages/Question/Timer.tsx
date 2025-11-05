import { useState, useEffect } from "react"
import { Action, Actions } from "../../state/actions"

/**
 * Timer component that counts down from the given time in seconds,
 * the timer is a circle that fills up as time passes, like a hand
 * of a clock. Everything behind the hind is filled in
 */
export function Timer({
	dispatch,
	time,
}: {
	time: number
	dispatch: React.Dispatch<Action>
}) {
	const radius = 24
	const stroke = 2
	const circumference = 2 * Math.PI * radius
	const size = (radius + stroke) * 2
	const [elapsed, setElapsed] = useState(0)

	useEffect(() => {
		let frame: number | null = null
		let start: number | null = null

		const animate = (now: number) => {
			if (start === null) start = now
			const seconds = Math.min((now - start) / 1000, time)
			setElapsed(seconds)

			if (seconds < time) {
				frame = requestAnimationFrame(animate)
			} else {
				dispatch({
					type: Actions.TIMED_OUT,
				})
			}
		}

		setElapsed(0)

		if (time > 0) {
			frame = requestAnimationFrame(animate)
		}

		return () => {
			if (frame !== null) cancelAnimationFrame(frame)
		}
	}, [time])

	const progress = time <= 0 ? 1 : Math.min(elapsed / time, 1)
	const remaining = Math.max(Math.ceil(time - elapsed), 0)
	const offset = circumference * (1 - progress)

	return (
		<div
			role="timer"
			aria-live="polite"
			style={{
				position: "relative",
				width: size,
				height: size,
				flexShrink: 0,
			}}
		>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="rgba(255, 255, 255, 0.2)"
						strokeWidth={stroke}
						fill="transparent"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#f9d423"
						strokeWidth={stroke}
						fill="transparent"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						strokeLinecap="round"
					/>
				</g>
			</svg>
			<span
				style={{
					position: "absolute",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontVariantNumeric: "tabular-nums",
					fontWeight: 600,
					fontSize: "1.5rem",
					color: "white",
					textShadow: "0 1px 2px rgba(0,0,0,0.4)",
				}}
			>
				{remaining}
			</span>
		</div>
	)
}