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
        Schema::table('ocene', function (Blueprint $table) {
            $table->integer('ocena')->nullable()->change();
            $table->date('datum')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ocene', function (Blueprint $table) {
            $table->integer('ocena')->change(); 
            $table->date('datum')->change();
        });
    }
};
