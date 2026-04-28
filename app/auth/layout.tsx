import ShopNav from "@/components/shop/ShopNav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ShopNav />
      {children}
    </>
  );
}
