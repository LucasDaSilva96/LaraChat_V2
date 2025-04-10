import { ECHO } from '@/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { Conversation, User } from '@/types/main';
import { Link, usePage } from '@inertiajs/react';
import { AlignRight } from 'lucide-react';
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


    console.log(conversations, selectedConversation);

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
                console.log('User joined:', user);
                setOnlineUsers((prevUsers) => ({
                    ...prevUsers,
                    [user.id]: user,
                }));
            }
            )
            .leaving((user: User) => {
                console.log('User left:', user);
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

    console.log('Online users:', onlineUsers);

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
        <main className='w-full h-screen flex flex-col px-1 md:px-2 lg:px-4'>
            <header className='w-full p-2 flex items-center justify-between'>
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
            {children}
        </main>
    )
}
