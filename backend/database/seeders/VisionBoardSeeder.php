<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VisionBoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vision_boards')->insert([
            [
                'name' => 'Objectifs 2025',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Projets personnels',
                'visibility' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Voyages à venir',
                'visibility' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
