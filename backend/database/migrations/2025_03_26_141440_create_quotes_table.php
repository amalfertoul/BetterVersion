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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->text('quote_text'); // The actual quote
            $table->string('author_name')->nullable(); // Name of the author (nullable if unknown)
            $table->string('category')->default('general'); // Category of the quote
            $table->timestamps(); // Created at and updated at timestamps
       });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
