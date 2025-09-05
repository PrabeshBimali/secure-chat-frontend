interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      {/* Optional sidebar placeholder */}
      {/* <aside className="hidden md:block w-64 bg-bg-secondary p-4">
        Sidebar here
      </aside> */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}