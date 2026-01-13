interface AppLayoutProps {
  children: React.ReactNode
}

export default function BasicLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen bg-bg-primary text-text-primary">
      {children}
    </div>
  );
}