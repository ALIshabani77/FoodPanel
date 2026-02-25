export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f5f2] font-[Vazirmatn]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
