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
        Schema::create('prayer_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date'); // Tanggal sholat
            // Subuh
            $table->string('subuh_status')->default('belum'); // iya, tidak, belum
            $table->text('subuh_reason')->nullable();
            $table->string('subuh_image')->nullable();
            $table->time('subuh_time')->nullable(); // waktu mencatat subuh
            $table->decimal('subuh_latitude', 10, 7)->nullable();
            $table->decimal('subuh_longitude', 10, 7)->nullable();
        
            // Dzuhur
            $table->string('dzuhur_status')->default('belum');
            $table->text('dzuhur_reason')->nullable();
            $table->string('dzuhur_image')->nullable();
            $table->time('dzuhur_time')->nullable();
            $table->decimal('dzuhur_latitude', 10, 7)->nullable();
            $table->decimal('dzuhur_longitude', 10, 7)->nullable();
        
            // Asar
            $table->string('asar_status')->default('belum');
            $table->text('asar_reason')->nullable();
            $table->string('asar_image')->nullable();
            $table->time('asar_time')->nullable();
            $table->decimal('asar_latitude', 10, 7)->nullable();
            $table->decimal('asar_longitude', 10, 7)->nullable();
        
            // Maghrib
            $table->string('maghrib_status')->default('belum');
            $table->text('maghrib_reason')->nullable();
            $table->string('maghrib_image')->nullable();
            $table->time('maghrib_time')->nullable();
            $table->decimal('maghrib_latitude', 10, 7)->nullable();
            $table->decimal('maghrib_longitude', 10, 7)->nullable();
        
            // Isya
            $table->string('isya_status')->default('belum');
            $table->text('isya_reason')->nullable();
            $table->string('isya_image')->nullable();
            $table->time('isya_time')->nullable();
            $table->decimal('isya_latitude', 10, 7)->nullable();
            $table->decimal('isya_longitude', 10, 7)->nullable();
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
