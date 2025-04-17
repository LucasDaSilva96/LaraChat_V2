import ChatLayout from '@/layouts/ChatLayout';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Home() {
    const { auth } = usePage<SharedData>().props;

    return (
        <ChatLayout>
            <h1>Hello World</h1>

        </ChatLayout>

    );
}
