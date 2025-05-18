<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'username' => 'lupus',
                'fullname' => 'Lupus Maximus',
                'email' => 'lupus@example.com',
                'profile_picture' => 'pfp/lupus.jfif',
                'password' => Hash::make('1234'),
                'isAdmin' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'caesar',
                'fullname' => 'Caesar Augustus',
                'email' => 'caesar@example.com',
                'profile_picture' => 'pfp/caesar.jfif',
                'password' => Hash::make('1234'),
                'isAdmin' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'marcus',
                'fullname' => 'Marcus Aurelius',
                'email' => 'marcus@example.com',
                'profile_picture' => 'pfp/marcus.jfif',
                'password' => Hash::make('1234'),
                'isAdmin' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
