import Collection from "./components/Collection";

export default function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Solana Sandbox</h1>
      <Collection />
    </main>
  );
}
