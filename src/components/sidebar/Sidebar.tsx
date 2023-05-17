import { getCurrentUser } from '@/actions';
import DesktopSidebar from '@/components/sidebar/DesktopSidebar';
import MobileFooter from '@/components/sidebar/MobileFooter';

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
