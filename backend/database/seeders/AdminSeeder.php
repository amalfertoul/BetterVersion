<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Admin::create([
            'login' => 'Yousra Hamdan',
            'email' => 'youyousstahm26@gmail.com',
            'password' => Hash::make('Study-studydev2025'),
            'name' => 'Yousra Hamdan',
        ]);

        // You can add more admins here later if needed
    }
}
