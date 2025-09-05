interface AppLayoutProps {
  children: React.ReactNode
}

export default function BasicLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 text-gray-900">
      {children}
    </div>
  );
}