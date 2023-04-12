import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import { useRouter } from "preact-router";

export function Neactapp() {
  const [router, setRouter] = useRouter();
  const match = Object.values(router.matches)[0];
  console.log(match);

  const iframeSrc = signal(`http://localhost:3000/${match}`);

  // useEffect(() => {
  //   const listenHandler = () => {
  //     // console.log(window.location.pathname);
  //   };
  //   window.addEventListener("app:route:change", listenHandler);
  //   return () => {
  //     window.removeEventListener("app:route:change", listenHandler);
  //   };
  // }, []);

  return (
    <div class="nextapp">
      <iframe allow="fullscreen" src={iframeSrc} frameBorder="0"></iframe>
    </div>
  );
}
