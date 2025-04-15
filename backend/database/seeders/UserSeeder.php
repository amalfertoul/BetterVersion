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
            [
                'username' => 'hm_yousra',
                'fullname' => 'Yousra Hamdan',
                'email' => 'youyousstahm26@gmail.com',
                'profile_picture' => null,
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'ben_khadija',
                'fullname' => 'Khadija Ben Khadda',
                'email' => 'benkhaddakhadija@gmail.com',
                'profile_picture' => null,
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'username' => 'fr_amal',
                'fullname' => 'Amal Fertoul',
                'email' => 'fertoulamal@gmail.com',
                'profile_picture' => null,
                'password' => Hash::make('admin'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
