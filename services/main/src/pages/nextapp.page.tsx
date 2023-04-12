import { useEffect, useLayoutEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import { useRouter } from "preact-router";

export function Neactapp() {
  const [router, setRouter] = useRouter();
  const match = Object.values(router.matches)[0];
  console.log(match);

  const src = signal(`http://localhost:3000/${match}`);
  useLayoutEffect(() => {
    async function renderMyPage() {
      const response = await fetch(`http://localhost:3000/${match}`);
      const html = await response.text();
      console.log(html);
      // Hiển thị HTML đã được render trong ứng dụng của bạn
      // document.getElementById("nextapp").innerHTML = html;
    }

    renderMyPage();
  });

  return <div id="nextapp"></div>;
}
