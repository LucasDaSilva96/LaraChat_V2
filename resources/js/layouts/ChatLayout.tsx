import { ECHO } from '@/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SharedData } from '@/types';
import { Conversation, User } from '@/types/main';
import { Link, usePage } from '@inertiajs/react';
import { AlignRight, PencilLine } from 'lucide-react';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';


interface OnlineUsersObject {
    [key: string]: User;
}


export default function ChatLayout({ children }: PropsWithChildren) {

    const page = usePage();

    const { auth } = usePage<SharedData>().props;

    const conversations = useMemo(() => page?.props?.conversations as Conversation || [], [page?.props?.conversations]);

    const selectedConversation = page?.props?.selectedConversation as Conversation || null;

    const [onlineUsers, setOnlineUsers] = useState<OnlineUsersObject>({});

    const [localConversations, setLocalConversations] = useState<Conversation[]>([]);

    const [sortedConversations, setSortedConversations] = useState<Conversation[]>([]);

    const isUserOnline = (userId: number) => {
        return !!onlineUsers[userId];
    };



    useEffect(() => {

        ECHO.join('online')
            .here((users: User[]) => {
                const onlineUsersObject = Object.fromEntries(users.map((user) => [user.id, user]));

                setOnlineUsers((prevUsers) => ({
                    ...prevUsers,
                    ...onlineUsersObject,
                }));
            }
            )
            .joining((user: User) => {
                // console.log('User joined:', user);
                setOnlineUsers((prevUsers) => ({
                    ...prevUsers,
                    [user.id]: user,
                }));
            }
            )
            .leaving((user: User) => {
                // console.log('User left:', user);
                setOnlineUsers((prevUsers) => {
                    const newUsers = { ...prevUsers };
                    delete newUsers[user.id];
                    return newUsers;
                });
            }
            )
            .error((error: User) => {
                console.error('Error:', error);
            }
            );

        return () => {
            ECHO.leave('online');
        }

    }, []);

    // console.log('Online users:', onlineUsers);

    console.log('Conversations:', conversations);
    console.log('Selected conversation:', selectedConversation);

    useEffect(() => {

        setLocalConversations((prev) => [
            ...prev,
            conversations,
        ]);

    }, [conversations]);

    useEffect(() => {
        const sorted = localConversations.sort((a, b) => {

            if (a.blocked_at && b.blocked_at) {
                return new Date(a.blocked_at) > new Date(b.blocked_at) ? 1 : -1;
            } else if (a.blocked_at) {
                return 1;
            } else if (b.blocked_at) {
                return -1;
            }

            if (a.last_message_date && b.last_message_date) {
                return new Date(a.last_message_date) > new Date(b.last_message_date) ? -1 : 1;

            } else if (a.last_message_date) {
                return -1;
            } else if (b.last_message_date) {
                return 1;
            }


            return 0;

        })

        setSortedConversations(sorted);

    }, [localConversations]);

    return (
        <main className='w-full h-screen flex flex-col'>
            <header className='w-full p-2 flex items-center justify-between px-1 md:px-2 lg:px-4'>
                <aside className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={auth.user.avatar} />
                        <AvatarFallback />
                    </Avatar>

                    <h1 className='text-base md:text-lg font-light opacity-70'>
                        @{auth.user.name}
                    </h1>
                </aside>


                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <AlignRight className='cursor-pointer' />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>

                        <DropdownMenuItem>
                            <Link href='/settings/profile'>
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link method='post' href={route('logout')}>
                                Log out
                            </Link>
                        </DropdownMenuItem>


                    </DropdownMenuContent>
                </DropdownMenu>

            </header>
            <section className='w-full h-full flex'>
                <aside className='w-[240px] md:w-[340px] flex flex-col gap-2 max-h-[93dvh] overflow-y-auto p-2 bg-gray-400/10 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10'>

                    <div className='w-full flex items-center justify-between px-1'>
                        <h1 className='text-center text-base md:text-xl'>
                            My Conversations
                        </h1>
                        <button className='cursor-pointer hover:bg-gray-400/10 p-1 rounded-md'>
                            <PencilLine size={20} />
                        </button>
                    </div>
                    <Input type='text' placeholder='Filter users and groups' />

                    <div className='w-full h-full pb-2 overflow-y-auto'>


                    </div>

                </aside>
                {children}
            </section>
        </main>
    )
}
