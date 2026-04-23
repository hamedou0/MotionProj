import './globals.css';
import NavbarClient from '../components/NavbarClient';

export const metadata = {
  title: 'Motion Industries',
  description: 'Industrial product explorer and account settings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <NavbarClient />
        {children}
      </body>
    </html>
  );
}
