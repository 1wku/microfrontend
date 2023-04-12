import React, { useState } from 'react'

export function Dashboard() {
	const [a, seta] = useState(0)
	return (
		<div>
			<h1>DashBoard</h1>
			<button onClick={() => seta(p => p + 1)}>{a}</button>
		</div>
	)
}
