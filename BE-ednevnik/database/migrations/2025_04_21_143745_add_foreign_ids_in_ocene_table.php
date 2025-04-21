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
            $table->foreign('ucenik_id')->references('id')->on('ucenici')->onDelete('cascade');
            $table->foreign('predmet_id')->references('id')->on('predmeti')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ocene', function (Blueprint $table) {
            $table->dropForeign(['ucenik_id']);
            $table->dropForeign(['predmet_id']);
        });
    }
};
