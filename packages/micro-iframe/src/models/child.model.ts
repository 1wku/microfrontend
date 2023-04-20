import { v4 as uuid } from 'uuid'

export type AuthReturnType = { isSuccess: boolean; data: any }

export class Child {
	private _isEmbed: boolean = false
	private _origin: string
	private _appName: string

	constructor() {}

	installNextRouter(router: any) {
		router.events.on('routeChangeComplete', path =>
			this.sendMessage('route', path),
		)
	}
	/**
	 * * Phải được gọi trong **lần đầu tiên** render của app
	 * * Sử dụng window.parent === window để xác có đang được nhúng vào bên trong của một iframe không
	 * * Hàm có nhiệm vụ kiểm tra kết nối với cha bằng cách postMessage với nội dung null ra ngoài
	 * @param appname - Tên của
	 */
	init() {
		if (window.parent !== window) {
			const origin = document.cookie
				.split(';')
				.reduce((p, c) => {
					const cookie = c.split('=')
					return Object.assign({}, p, {
						[cookie[0]]: cookie[1],
					})
				}, {})['host-origin']
			this._origin = origin
			this._isEmbed = true
			this._appName = window.origin
			this.sendMessage('init', null, () => {
				console.info('Connect success full')
			})
			this.sendMessage('route', window.location.pathname)
		}
	}

	/**
	 * @description
	 * Được gọi để kiển tra authN:
	 * * Trường hợp **Standalone**: Sẽ gọi tới hàm auth nội bộ
	 * * Trường hợp **Embed**: Sẽ postMessage tới app cha để nhận thông tin auth
	 * @param fn - Hàm được gọi sau khi việc auth hoàn thành
	 */
	/**
	 * @description
	 * Hàm phải được được gọi vào sự kiện route của app có sự thay đổi
	 * @example
	 * import router from "next/router";
	 * useEffect(() => {
	 *    router.events.on("routeChangeStart", handleRouteChange);
	 *    return () => router.events.off("routeChangeStart", handleRouteChange);
	 * }, []);
	 */
	auth(fn: (value: AuthReturnType) => void) {
		this.sendMessage(
			'auth',
			null,
			e => {
				fn(e.data)
			},
			() => {
				fn({
					isSuccess: true,
					data: { role: 'from child' },
				})
				//FIXME  FireBase auth
			},
		)
	}
	/**
	 * @description Gửi tin nhắn cho cha từ iframe con
	 * @param event - Định danh để phí Host có thể có listener riêng
	 * @param data - Data muốn gửi đi
	 * @param fn - Callback được gọi khi có trả lời đúng với tin nhắn được gửi đi
	 * @param saFn - Callback được gọi nếu ứng dụng đang không embed
	 */
	public sendMessage(
		event: 'message' | 'auth' | 'route' | 'init',
		data: any,
		fn?: (event: MessageEvent<any>) => void,
		saFn?: (...any: any) => any,
	) {
		if (this._isEmbed) {
			const id = uuid()
			window.parent.postMessage(
				{ appName: this._appName, event, id, data },
				this._origin,
			)
			if (fn) {
				const fnProxy = new Proxy(fn, {
					apply(target, thisArg, args) {
						const e = args[0]
						if (e.data.id === id) {
							Reflect.apply(target, thisArg, [e.data])
							window.removeEventListener(
								'message',
								fnProxy,
								false,
							)
						}
					},
				})
				window.addEventListener('message', fnProxy, false)
			}
		} else {
			if (saFn) saFn()
		}
	}
}
