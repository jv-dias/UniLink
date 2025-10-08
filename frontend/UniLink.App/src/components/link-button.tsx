// React import not required with automatic JSX runtime
import { Button } from '@/components/ui/button';

export function LinkButton({ title, url }: { title: string; url: string }) {
  function open() {
    window.open(url, '_blank');
    // small pulse animation could be handled via CSS classes
    console.log('Public link clicked', url);
  }

  return (
    <div className="w-full">
      <Button onClick={open} className="w-full justify-center transition-transform hover:scale-[1.02]">
        {title}
      </Button>
    </div>
  );
}
