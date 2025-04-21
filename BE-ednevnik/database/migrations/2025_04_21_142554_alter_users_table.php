<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Dodajemo novu kolonu koja ce nam biti za tipove na aplikaciji
            $table->string('tip_korisnika')->default('ucenik');

            // Uklanjamo kolone koje necemo koristii - name ce biti u drugim tabelama
            $table->dropColumn('name');
            $table->dropColumn('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name');
            $table->timestamp('email_verified_at')->nullable();

            $table->dropColumn('tip_korisnika');
        });
    }
};
