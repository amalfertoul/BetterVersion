<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call([
            QuotesTableSeeder::class,
        ]);
        $this->call([
            AdminSeeder::class,
        ]);
        
    }
}
