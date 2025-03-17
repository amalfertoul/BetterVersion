<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Technologie', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Science', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Art', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Musique', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Sport', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Voyage', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
