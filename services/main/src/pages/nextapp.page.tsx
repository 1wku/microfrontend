import { useEffect, useRef } from 'preact/hooks'
import { signal } from '@preact/signals'
import { useRouter } from 'preact-router'
import { host } from '../app'

export function Neactapp() {
	const [router] = useRouter()
	const ref = useRef<HTMLIFrameElement>(null)
	console.log(router.matches)
	const match = Object.values(router.matches)[0]

	const iframeSrc = signal(`http://app2.local.com:3000/${match}`)

	useEffect(() => {
		//NOTE - Connect
		host.addApp('app2', ref.current as HTMLIFrameElement)

		//NOTE
		const cleaner = host.onRouteChange('app2', path => {
			window.history.pushState({}, '', '/app2' + path)
		})
		return () => {
			cleaner()
		}
	}, [])

	return (
		<div class="nextapp">
			{iframeSrc}
			<iframe
				id="iframe-101"
				ref={ref}
				allow="fullscreen"
				src={iframeSrc}
				frameBorder="0"
			></iframe>
		</div>
	)
}
