export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-12">
      {children}
    </div>
  );
}
