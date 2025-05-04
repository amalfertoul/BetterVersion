<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            MessagesSeeder::class,
            MiniGamesSeeder::class,
            QuotesTableSeeder::class,
            UsersSeeder::class,
        ]);
    }
}
