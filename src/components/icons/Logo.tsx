import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image 
        src="https://aquavietnam.com.vn/wp-content/themes/aqua-themes-2306/assets/img/aqua-logo.png" 
        alt="AQUA VN Logo"
        width={100}
        height={28}
        priority
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100px',
          maxHeight: '28px'
        }}
      />
    </Link>
  );
}
