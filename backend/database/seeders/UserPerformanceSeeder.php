<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserPerformanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_performances')->insert([
            [
                'score' => 1200,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'score' => 850,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'score' => 1560,
                'timestamp' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
