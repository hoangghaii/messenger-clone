import { getConversations, getUsers } from '@/actions';
import Sidebar from '@/components/sidebar/Sidebar';

import ConversationList from './components/ConversationList';

type Props = {
  children: React.ReactNode;
};

const ConveratioLayout = async ({ children }: Props) => {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    // @ts-expect-error Async Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList
          users={users}
          title="Messages"
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
};

export default ConveratioLayout;
