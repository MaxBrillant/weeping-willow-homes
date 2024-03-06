export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="w-full max-w-[640px] mx-auto">{children}</section>;
}
