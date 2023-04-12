import { useLayoutEffect, useMemo } from 'preact/hooks'
import { render } from 'reactapp'

render({ baseURL: '/app1' })

export function Reactapp() {
	return (
		<>
			<react-app />
		</>
	)
}
