import Link from "next/link";

export function GameNavBar() {
    return (
        <div className="fixed top-12 right-30">
            <Link href="/dev" className="text-yellow-500 text-l font-semibold px-4 py-2 border-y-2 border-transparent hover:border-current">DEV</Link>
            <Link href="/game" className="text-yellow-500 text-l font-semibold px-4 py-2 border-y-2 border-transparent hover:border-current">GAME</Link>
            <Link href="/film" className="text-yellow-500 text-l font-semibold px-4 py-2 border-y-2 border-transparent hover:border-current">FILM</Link>
            <Link href="/book" className="text-yellow-500 text-l font-semibold px-4 py-2 border-y-2 border-transparent hover:border-current">BOOK</Link>
        </div>
    );
}