import { v4 as uuid } from 'uuid'
import router from 'next/router'

export type AuthReturnType = { isSuccess: boolean; data: any }

/**
 * @example
 * // nextjs
 * // pages/_app.tsx
 * import {Child} from 'micro-frame'
 *
 * export const child = new Child()
 *
 * export default function App({ Component, pageProps }: AppProps) {
 * // your code
 *   useEffect(() => {
 *      child.init()
 *     // your effect
 *     router.events.on("routeChangeStart", child.postRouteChange);
 *     return () => router.events.off("routeChangeStart", child.postRouteChange);
 *   }, []);
 *   return (
 *     <>
 *       <Component {...pageProps} />;
 *     </>
 *   );
 * }
 *
 * @example
 * // nextjs
 * // pages/demo.page.tsx
 *
 * export default function Demo() {
 *   const [count, setCount] = useState(0);
 *   const [isAuth, setAuth] = useState<boolean>(false);
 *   const [role, setRole] = useState(null);
 *
 *   useEffect(() => {
 *     child.auth((e) => {
 *       setAuth(e.isSuccess);
 *       setRole(e.data.role);
 *     });
 *   }, []);
 *
 *   return (
 *     <div>
 *       {isAuth ? (
 *         <>
 *           Your page
 *         </>
 *       ) : (
 *         <h1>No authN</h1>
 *       )}
 *     </div>
 *   );
 * }
 *
 */
export class Child {
	private _isEmbed: boolean = false
	private _origin: string
	private _appName: string

	/**
	 * @returns
	 */
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
			this._isEmbed = true
			this._origin = document.location.ancestorOrigins[0]
			this.sendMessage('route', window.location.pathname),
				(this._appName = window.origin)
			this.sendMessage('init', null, () => {
				console.info('Connect success full')
			})
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
