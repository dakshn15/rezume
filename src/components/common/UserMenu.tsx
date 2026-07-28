import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { CustomButton } from '@/components/ui/custom-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, FileText, LayoutTemplate, ArrowRight } from 'lucide-react';

interface UserMenuProps {
  variant?: 'default' | 'editor';
}

export const UserMenu: React.FC<UserMenuProps> = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const userName = useAuthStore((state) => state.userName);
  const userEmail = useAuthStore((state) => state.userEmail);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const logout = useAuthStore((state) => state.logout);

  React.useEffect(() => {
    if (token && (!userName || !userEmail)) {
      fetchUserProfile();
    }
  }, [token, userName, userEmail, fetchUserProfile]);

  const isAuthenticated = !!token;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!isAuthenticated) {
    if (variant === 'editor') {
      return (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <CustomButton variant="outline" size="sm" className="h-8 px-3 text-xs">
              Log In
            </CustomButton>
          </Link>
          <Link to="/register">
            <CustomButton variant="primary" size="sm" className="h-8 px-3 text-xs">
              Sign Up
            </CustomButton>
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
          Login
        </Link>
        <Link to="/register">
          <CustomButton variant="primary" size="sm" className="gap-1">
            Get Started <ArrowRight className="h-4 w-4" />
          </CustomButton>
        </Link>
      </div>
    );
  }

  const displayName = userName || userEmail?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full p-1 hover:bg-muted/80 transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center shadow-sm">
            {initial}
          </div>
          {variant !== 'editor' && (
            <span className="hidden md:inline-block text-sm font-medium text-foreground max-w-[120px] truncate">
              {displayName}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-50">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayName}</p>
            {userEmail && (
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/editor')} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Resume Editor</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/templates')} className="cursor-pointer">
          <LayoutTemplate className="mr-2 h-4 w-4" />
          <span>Templates</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
