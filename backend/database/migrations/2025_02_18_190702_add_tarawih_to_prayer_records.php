<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('prayer_records', function (Blueprint $table) {
            $table->string('tarawih_status')->default('belum')->after('isya_longitude');
            $table->text('tarawih_reason')->nullable()->after('tarawih_status');
            $table->string('tarawih_image')->nullable()->after('tarawih_reason');
            $table->time('tarawih_time')->nullable()->after('tarawih_image');
            $table->decimal('tarawih_latitude', 10, 7)->nullable()->after('tarawih_time');
            $table->decimal('tarawih_longitude', 10, 7)->nullable()->after('tarawih_latitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('prayer_records', function (Blueprint $table) {
            $table->dropColumn([
                'tarawih_status',
                'tarawih_reason',
                'tarawih_image',
                'tarawih_time',
                'tarawih_latitude',
                'tarawih_longitude'
            ]);
        });
    }
};