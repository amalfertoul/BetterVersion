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
        Schema::create('vision_boards', function (Blueprint $table) {
            $table->id('board_id');
            $table->string('name');
            $table->boolean('visibility')->default(true); // assuming default visibility is true

            //user_id is the foreign key referencing the users table
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            //task_id is the foreign key referencing the tasks table
            $table->unsignedBigInteger('task_id')->nullable();
            $table->foreign('task_id')->references('task_id')->on('tasks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vision_boards');
    }
};
