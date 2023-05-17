import { getUsers } from '@/actions';
import UserList from '@/app/users/components/UserList';
import Sidebar from '@/components/sidebar/Sidebar';

async function UsersLayout({ children }: { children: React.ReactNode }) {
  const users = await getUsers();

  return (
    // @ts-expect-error Async Server Component
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}

export default UsersLayout;
