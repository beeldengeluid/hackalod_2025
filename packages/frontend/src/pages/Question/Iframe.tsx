import clsx from "clsx"
import { useState, useRef, useEffect } from "react"
import { Question } from "../../../../backend/src/common"

import styles from "./Iframe.module.css"

export function Iframe({ question }: { question: Question }) {
	const [coverUp, setCoverUp] = useState(false)
	const ref = useRef<HTMLIFrameElement>(null)

	useEffect(() => {
		if (question.musicSample && ref.current) {
			ref.current!.src =
				question.musicSample.replace("embed", "Embed") +
				"/niet-bekent?theme=anim&color=white"
		}
	}, [question.musicSample])

	if (question.musicSample == null) return null

	return (
		<div className={clsx(styles.iframeContainer, { [styles.covered]: coverUp })}>
			<div
				className={styles.cover}
				onClick={() => {
					console.log("COVERING")
					setCoverUp(true)
				}}
			/>
			<iframe
				className={styles.iframe}
				ref={ref}
				width="330"
				height="40"
				src=""
				frameBorder="no"
				scrolling="no"
				allowTransparency={true}
			/>
		</div>
	)
}
