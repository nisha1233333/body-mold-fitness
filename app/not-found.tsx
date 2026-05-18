import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <Dumbbell className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Go Home</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="border-white/20 hover:bg-white/5">Browse Shop</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
