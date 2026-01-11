import './globals.css'
import {ReactNode} from 'react';

type Props = {
  children: ReactNode;
};

// Root layout - minimal, just provides HTML structure
// The locale-specific layout handles providers and UI chrome
export default function RootLayout({children}: Props) {
  return children;
}
