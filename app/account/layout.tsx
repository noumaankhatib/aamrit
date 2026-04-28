import ShopNav from "@/components/shop/ShopNav";

export default function AccountLayout({
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
