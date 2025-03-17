<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FriendRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('friend_requests')->insert([
            [
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'status' => 'accepted',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'status' => 'rejected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
