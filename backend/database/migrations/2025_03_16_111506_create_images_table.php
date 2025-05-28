<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id('id');
            $table->string('url')->nullable();
            $table->text('description');
            $table->foreignId('user_id')->constrained('users'); 
            $table->foreignId('category_id')->constrained('categories');
            $table->timestamps();
            $table->foreignId('vision_board_id')->nullable()->constrained('vision_boards')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
