import { Button } from "@/components/ui/button";

interface TopAppBarProps {
  title?: string;
  onMenuClick: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

export function TopAppBar({
  title,
  onMenuClick,
  showBackButton = false,
  onBackClick,
  rightAction,
}: TopAppBarProps) {
  return (
    <div className="md:hidden bg-primary text-white shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-primary-dark" 
              onClick={onBackClick}
            >
              <span className="material-icons">arrow_back</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-primary-dark" 
              onClick={onMenuClick}
            >
              <span className="material-icons">menu</span>
            </Button>
          )}
          {title && <h1 className="ml-3 text-xl font-medium">{title}</h1>}
        </div>
        {rightAction && (
          <div>
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
}
