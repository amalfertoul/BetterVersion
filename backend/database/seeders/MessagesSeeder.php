<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MessagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('messages')->insert([
            [
                'type' => 'text',
                'content' => 'Salut, comment ça va ?',
                'active_scope' => 'private',
                'sender_id' => 1,
                'receiver_id' => 2,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'text',
                'content' => 'Je vais bien, merci ! Et toi ?',
                'active_scope' => 'private',
                'sender_id' => 2,
                'receiver_id' => 1,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'text',
                'content' => 'As-tu vu le dernier projet que j\'ai partagé ?',
                'active_scope' => 'private',
                'sender_id' => 1,
                'receiver_id' => 2,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'text',
                'content' => 'Oui, c\'est vraiment impressionnant !',
                'active_scope' => 'private',
                'sender_id' => 2,
                'receiver_id' => 1,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'text',
                'content' => 'Merci beaucoup !',
                'active_scope' => 'private',
                'sender_id' => 1,
                'receiver_id' => 2,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
