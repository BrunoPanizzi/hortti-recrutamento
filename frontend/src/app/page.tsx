export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[1fr_auto] min-h-screen">
      <main className="flex w-[min(calc(100%-2rem),56rem)] mx-auto">
        Hello, World!
      </main>
      <footer className="text-center text-sm">Made with love by 💙 <a href="https://github.com/BrunosPanizzi" target="_blank" rel="noopener noreferrer" className="text-cyan-100 hover:text-cyan-200 hover:underline">Bruno Panizzi</a></footer>
    </div>
  );
}
