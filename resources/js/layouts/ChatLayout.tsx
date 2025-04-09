import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlignRight } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function ChatLayout({ children }: PropsWithChildren) {

    const page = usePage();

    const { auth } = usePage<SharedData>().props;

    const conversations = page?.props?.conversations || [];

    const selectedConversation = page?.props?.selectedConversation || null;


    console.log(conversations, selectedConversation)

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
