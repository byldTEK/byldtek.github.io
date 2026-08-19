import '../globals.css';
import { sharedMetadata, sharedViewport, HeadFonts } from '../shared-head';
import { fontVariables } from '../fonts';

export const metadata = sharedMetadata;
export const viewport = sharedViewport;

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <head>
        <HeadFonts />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
