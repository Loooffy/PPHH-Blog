import Link from "next/link";

export function GameNavBar() {
    return (
        <div className="fixed z-1111 top-8 right-30">
            <Link href="/dev" className="text-white text-l no-underline mx-2 py-2 border-b-2 border-transparent hover:border-current">DEV</Link>
            <Link href="/game" className="text-white text-l no-underline mx-2 py-2 border-b-2 border-transparent hover:border-current">GAME</Link>
            <Link href="/film" className="text-white text-l no-underline mx-2 py-2 border-b-2 border-transparent hover:border-current">FILM</Link>
            <Link href="/book" className="text-white text-l no-underline mx-2 py-2 border-b-2 border-transparent hover:border-current">BOOK</Link>
        </div>
    );
}