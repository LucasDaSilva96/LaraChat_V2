<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
            'avatar' => 'https://xsgames.co/randomusers/avatar.php?g=male',
        ]);


        User::factory()->create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
            'avatar' => 'https://xsgames.co/randomusers/avatar.php?g=female',
        ]);

        User::factory(10)->create([
            'is_admin' => false,
        ]);

      for ($i = 0; $i < 5; $i++) {
            $group = Group::factory()->create([
                'owner_id' => 1,
            ]);

            // Explicitly select 'users.id' to avoid ambiguity
            $users = User::query()
                ->inRandomOrder()
                ->limit(rand(2, 5))
                ->pluck('users.id')
                ->toArray();

            $group->users()->attach(array_unique([1, ...$users]));
        }

        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at', 'desc')->get();

        $conversations = $messages->groupBy(function ($messages) {
            return collect([$messages->sender_id, $messages->receiver_id])->sort()->implode('_');
        })->map(function ($groupMessages) {
            return [
                'user_id1' => $groupMessages->first()->sender_id,
                'user_id2' => $groupMessages->first()->receiver_id,
                'last_message_id'=> $groupMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());

    }
}
