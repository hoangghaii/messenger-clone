import { getConversations, getUsers } from '@/actions';
import ConversationList from '@/app/conversations/components/ConversationList';
import Sidebar from '@/components/sidebar/Sidebar';

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
