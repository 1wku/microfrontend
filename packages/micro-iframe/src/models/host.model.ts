import { AuthReturnType } from './child.model'

export type MessageType = {
	type: 'message' | 'auth' | 'route'
	data: unknown
}

export class Host {
	private apps: string[] = []
	private _isAuthReady: boolean = false
	private _iframes: Record<string, HTMLIFrameElement> = {}

	constructor() {}
	/**
	 * @param appName - id do người dùng đặt để phân biệt các app con
	 */
	addApp(appName: string, iframe: HTMLIFrameElement) {
		this._iframes[appName] = iframe
		window.addEventListener('message', e => {
			const data = e.data
			if (
				data.appName === appName &&
				!this.apps.includes(appName)
			) {
				console.info(`App "${appName}" init thành công`)
				this.apps.push(appName)
			}
		})
	}

	/**
	 *  Gọi khi app con có sự thay đổi về route
	 * @throws Báo lỗi nếu app name truyền vào không có trong danh sách app hiện tại
	 * @param appName - app name tương ứng với mục đích nhận biết và thay đổi path
	 * @param listener - Callback đuọc gọi khi có sự thay đổi của route của app con
	 * @returns - Trả về function cleaner event
	 */
	onRouteChange(
		appName: string,
		listener: (path: string) => void,
	): () => void {
		const handler = e => {
			if (!this.apps.includes(appName)) {
				throw 'App không tồn tại'
			}
			if (e.data.event === 'route') {
				listener(e.data.data)
			}
		}
		// this._iframes[appName].routeHandler = listener
		window.addEventListener('message', handler)

		return () => window.removeEventListener('message', handler)
	}
	onChildAuth(fn: () => AuthReturnType) {
		if (!this._isAuthReady) {
			this._isAuthReady = true
			window.addEventListener('message', e => {
				if (e.data.event === 'auth') {
					// NOTE chỗ này có thể tách ra thành một function
					const { isSuccess, data } = fn()
					Object.keys(this._iframes).map(i =>
						this._iframes[i].contentWindow.postMessage(
							{
								id: e.data.id,
								data: { isSuccess, data },
							},
							i,
						),
					)
				}
			})
		}
	}
}
