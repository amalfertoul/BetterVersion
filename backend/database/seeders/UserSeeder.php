<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'username' => 'amalfertoul',
            'fullname' => 'Amal Fertoul',
            'email' => 'amalfertoul@gmail.com',
            'profile_picture' => 'profile_pictures/image1.jpg',
            'password' => Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'username' => 'yousrahamdan',
            'fullname' => 'Yousra Hamdan',
            'email' => 'yousrahamdan@example.com',
            'profile_picture' => 'profile_pictures/image2.jpg',
            'password' => Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]); 
    }
}