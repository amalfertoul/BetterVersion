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
            ['name' => 'Nature', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Photographie', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cuisine', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Littérature', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Mode', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Design', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Maquillage', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Soins de la peau', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Coiffure', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Parfums', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Manucure', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Esthétique', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
