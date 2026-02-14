export interface LayoutProps {
  children: React.ReactNode
}

export default function BasicLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen bg-bg-primary text-text-primary">
      {children}
    </div>
  );
}